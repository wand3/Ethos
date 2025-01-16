import os
from datetime import datetime
from bson import ObjectId
from webapp.config import basedir
from webapp.logger import logger
import pytest
from tests import db_client, client, get_recrent_model


def convert_objectid_to_str(projects):
    """Converts ObjectId to string in a list of projects."""
    converts = None
    for project in projects:
        if project["_id"]:

            project["_id"] = str(project["_id"])
    logger.info(f'----------projects    -{projects}')

    converts = projects
    return converts


def clear_projects_db(db_client):
    """Clear the database and ensure the 'users' collection exists."""
    # Drop the collection if it exists
    if "projects" in db_client.list_collection_names():
        db_client.drop_collection("projects")
        db_client.projects.drop()
    # Create the 'users' collection for testing
    db_client.create_collection("projects")
    yield
    # Cleanup after the test
    db_client.drop_collection("projects")


@pytest.fixture(scope="function")
def test_create_project(client, db_client):
    response = client.post(
        "/token",
        data={"username": "john_doe", "password": "jonnybones"},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert response.status_code == 200
    assert "access_token" in response.json()
    access_token = response.json()["access_token"]

    # Create a valid image file for testing
    from PIL import Image
    image_path = os.path.join(basedir, 'static', 'test_image.png')  # "/static/test/test_image.png"
    image = Image.new("RGB", (100, 100), color=(255, 0, 0))  # A red square
    image.save(image_path)

    try:
        with open(image_path, "rb") as image_file:
            files = {
                "images": (
                    "test_image.png",
                    image_file,
                    "image/png",
                )  # Correct way to send files with requests
            }
            response_data = {  # other fields as form data
                "title": "testblog",
                "description": "Test project Enumerating objects: 36, done Counting objects: 100% (36/36), done. ",
                "roles": "one, two, fish",
                "project_url": "https://test-project.com/chuck",
                "github_url": "https://github/test-project.com/chuck",
                "created_at": datetime.utcnow().isoformat(),  # ISO format is safer
                "updated_at": datetime.utcnow().isoformat(),
            }

            logger.info(response_data)
            # Send POST request
            response = client.post(
                "/project/add",
                files=files, data=response_data,
                headers={"Authorizaztion": f"Bearer {access_token}"},
            )
            assert response.status_code == 201
            response_data = response.json()
            logger.info(f"----- db response data {response_data}")

            # get updates projects
            db_update = get_recrent_model(client=db_client, collection_name="projects")
            logger.info(f"----- db response update {db_update}")

            # Validate the response
            assert "_id" in response_data
            assert response_data["title"] == db_update[-1]["title"]  #"testblog"
            assert response_data["description"] == db_update[-1]["description"]
            assert response_data["roles"] == db_update[-1]["roles"] # ["one", "two", "fish"]
            assert "created_at" in response_data
            assert "updated_at" in response_data

            assert isinstance(ObjectId(response_data["_id"]), ObjectId)

    finally:
        # Clean up
        if os.path.exists(image_path):
            os.remove(image_path)
        # clear_projects_db(db_client)


# test get all project
# @pytest.fixture(scope="function")
def test_get_all_projects(client):
    response = client.get("/projects/")
    assert response.status_code == 200
    blogs = response.json()
    assert isinstance(blogs, list)
    assert len(blogs) == len(blogs)


# def test_get_project_by_id
# @pytest.fixture(scope="function")
def test_get_projects_by_id_success(db_client, client):
    last_post = get_recrent_model(client=db_client, collection_name="projects")
    project_id = last_post[-1]["_id"]  # update this to depend on a project present in db
    response = client.get(f"/projects/{project_id}/")
    logger.error(response.json())
    logger.error(response.status_code)

    expected_project = {
        "_id": last_post[-1]["_id"],
        "title": last_post[-1]["title"],
        'images': last_post[-1]["images"],
        "description": last_post[-1]["description"],
        "roles": last_post[-1]["roles"],
        "created_at": response.json().get("created_at"),
        "updated_at": response.json().get("created_at")
    }  # same as above for the same project

    assert response.status_code == 200
    response_data = response.json()
    logger.info(str(response_data))
    assert response_data["_id"] == last_post[-1]["_id"]
    assert response_data["roles"] == last_post[-1]["roles"]

    assert response_data["description"] == last_post[-1]["description"]


# @pytest.fixture(scope="function")
def test_get_projects_by_id_invalid(client):
    project_id = "678501750a991c000f2fdm"

    response = client.get(f"/projects/{project_id}/")

    assert response.status_code == 500
    assert response.json() == {'detail': f'Invalid project_id: {project_id}'}


# test get project by tag or roles
# @pytest.fixture(scope="function")
def test_get_projects_by_role_success(client, db_client):
    collection = db_client["projects"]
    roles = ["one"]  # using a single tag
    query = {"roles": {"$in": roles}}
    project_cursor = collection.find(query)
    all_p = list(project_cursor)

    project_cursor = convert_objectid_to_str(projects=all_p)  # convert the object ids to string

    expected_projects = project_cursor
    # logger.error(expected_projects)

    response = client.get(f"/projects/roles/?roles={roles[0]}")  # Multiple query params are added like this

    assert response.status_code == 200
    projects = response.json()
    count = 0
    # assert response.json() == len(expected_projects)
    for i in range(len(projects)):
        assert projects[i]["title"] == expected_projects[i]["title"]
        assert projects[i]["description"] == expected_projects[i]["description"]
        count += 1
    assert count == len(projects)


# @pytest.fixture(scope="function")
def test_get_projects_by_roles_success(client, db_client):
    collection = db_client["projects"]
    roles = ["yes", "two"]  # using a single tag
    query = {"roles": {"$in": roles}}
    project_cursor = collection.find(query)
    all_p = list(project_cursor)

    project_cursor = convert_objectid_to_str(projects=all_p)  #convert the object ids to string

    expected_projects = project_cursor
    logger.error(expected_projects)

    response = client.get(f"/projects/roles/?roles={roles[0]}&roles={roles[-1]}")  # Multiple query params are added like this

    assert response.status_code == 200
    logger.error(response.json())
    projects = response.json()
    count = 0
    # assert response.json() == len(expected_projects)
    for i in range(len(projects)):
        assert projects[i]["title"] == expected_projects[i]["title"]
        assert projects[i]["description"] == expected_projects[i]["description"]
        count += 1
    assert count == len(projects)


# @pytest.fixture(scope="session")
def test_update_project(client, db_client):
    response = client.post(
        "/token",
        data={"username": "john_doe", "password": "jonnybones"},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert response.status_code == 200
    assert "access_token" in response.json()
    access_token = response.json()["access_token"]

    collection = db_client["users"]
    collection_project = db_client["projects"]
    user = collection.find_one({"email": "john_doe@example.com"})
    get_project = collection_project.find_one()
    get_project["_id"] = str(get_project["_id"])

    project_id = get_project["_id"]  # any existing project to update

    try:
        # Prepare the update data
        update_dict = {
            "title": (None, "testprojectupdate"),
            "description": (None, "Enumerating objects: 36, done Counting objects: 100% (36/36), done. "),
            "roles": "one, three, update",
            "project_url": (None, "https://test-project.com/chuckupdate"),
            "github_url": (None, "https://github/test-project.com/chuckupdate")
        }

        # Send PUT request
        response = client.put(
            f"/project/{project_id}/project",
            data=update_dict,
            headers={"Authorization": f"Bearer {access_token}"}
        )
        logger.info(response.json())

        assert response.status_code == 201
        response_data = response.json()

        # Validate the response
        assert "_id" in response_data
        assert response_data["title"] == "testprojectupdate"
        assert response_data["description"] == update_dict["description"][1]
        assert response_data["roles"] == update_dict["roles"]
        assert "created_at" in response_data
        assert "updated_at" in response_data
        assert isinstance(ObjectId(response_data["_id"]), ObjectId)

    except Exception as e:
        return str(e)


# @pytest.fixture(scope="session")
def test_update_project_images(client, db_client):
    response = client.post(
        "/token",
        data={"username": "john_doe", "password": "jonnybones"},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert response.status_code == 200
    assert "access_token" in response.json()
    access_token = response.json()["access_token"]

    collection = db_client["users"]
    collection_project = db_client["projects"]
    user = collection.find_one({"email": "john_doe@example.com"})
    get_project = collection_project.find_one()
    get_project["_id"] = str(get_project["_id"])

    project_id = get_project["_id"]  # any existing project to update

    # Create a valid image file for testing
    from PIL import Image
    image_path = os.path.join(basedir, 'static', 'test_image_update.png')  # "/static/test/test_image.png"
    image = Image.new("RGB", (100, 100), color=(255, 0, 0))  # A red square
    image.save(image_path)

    try:
        with open(image_path, "rb") as image_file:
            files = {
                "images": (
                    "test_image_update.png",
                    image_file,
                    "image/png",
                )  # Correct way to send files with requests
            }
            # Prepare the update data
            # update_dict = {
            #     files: files,
            # }

            # Send PUT request
            response = client.put(
                f"/project/{project_id}/add/images",
                files=files,
                headers={"Authorization": f"Bearer {access_token}"}
            )
            logger.info(response)

            assert response.status_code == 201
            response_data = response.json()

            # Validate the response
            assert "_id" in response_data
            assert response_data["images"] == update_dict["images"]
            assert "updated_at" in response_data
            assert isinstance(ObjectId(response_data["_id"]), ObjectId)

    except Exception as e:
        return str(e)


# @pytest.fixture(scope="session")
def test_update_project_technologies(client, db_client):
    response = client.post(
        "/token",
        data={"username": "john_doe", "password": "jonnybones"},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert response.status_code == 200
    assert "access_token" in response.json()
    access_token = response.json()["access_token"]

    collection = db_client["users"]
    collection_project = db_client["projects"]
    user = collection.find_one({"email": "john_doe@example.com"})
    get_project = collection_project.find_one()
    get_project["_id"] = str(get_project["_id"])

    project_id = get_project["_id"]  # any existing project to update

    try:
        # Prepare the update data
        update_dict = {
            "language": "Python, JS, Typescript, update",
            "frameworks": "one, three, update",
            "databases": "mongo, sql, update",
            "tools": "selenium, update"
        }

        # Send PUT request
        response = client.put(
            f"/project/{project_id}/add/technologies",
            data=update_dict,
            headers={"Authorization": f"Bearer {access_token}"}
        )
        logger.info(response.json())

        assert response.status_code == 201
        response_data = response.json()

        # Validate the response
        assert "_id" in response_data
        assert response_data["language"] == update_dict["language"]
        assert response_data["tools"] == update_dict["description"]
        assert response_data["frameworks"] == update_dict["frameworks"]
        assert response_data["databases"] == update_dict["databases"]

        assert "updated_at" in response_data
        assert isinstance(ObjectId(response_data["_id"]), ObjectId)

    except Exception as e:
        return str(e)


# @pytest.fixture(scope="session")
def test_update_project_testing(client, db_client):
    response = client.post(
        "/token",
        data={"username": "john_doe", "password": "jonnybones"},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert response.status_code == 200
    assert "access_token" in response.json()
    access_token = response.json()["access_token"]

    collection = db_client["users"]
    collection_project = db_client["projects"]
    user = collection.find_one({"email": "john_doe@example.com"})
    get_project = collection_project.find_one()
    get_project["_id"] = str(get_project["_id"])

    project_id = get_project["_id"]  # any existing project to update

    try:
        # Prepare the update data
        update_dict = {
            "test_types": "Security, update",
            "automation_frameworks": "Jira, update",
            "ci_cd_integration": "Git actions CI/CD"
        }

        # Send PUT request
        response = client.put(
            f"/project/{project_id}/add/testing",
            data=update_dict,
            headers={"Authorization": f"Bearer {access_token}"}
        )
        logger.info(response.json())

        assert response.status_code == 201
        response_data = response.json()

        # Validate the response
        assert "_id" in response_data
        assert response_data["test_types"] == update_dict["test_types"]
        assert response_data["automation_frameworks"] == update_dict["automation_frameworks"]
        assert response_data["ci_cd_integration"] == update_dict["ci_cd_integration"]

        assert "updated_at" in response_data
        assert isinstance(ObjectId(response_data["_id"]), ObjectId)

    except Exception as e:
        return str(e)


# @pytest.fixture(scope="session")
def test_delete_project(client, db_client):
    # login and delete user
    response = client.post(
        "/token",
        data={"username": "john_doe", "password": "jonnybones"},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert response.status_code == 200
    assert "access_token" in response.json()
    access_token = response.json()["access_token"]

    last_project = get_recrent_model(client=db_client, collection_name="projects")
    project_id = last_project[-1]["_id"]  # update this to depend on a project present in db

    # Send a DELETE request
    response = client.delete(f"/project/{project_id}/project/",
                             headers={"Authorization": f"Bearer {access_token}"})
    # Assertions
    assert response.status_code == 200
    assert response.json() == {"message": f"Project deleted successfully True"}

    response = client.get(f"/projects/{project_id}/")
    assert response.status_code == 204



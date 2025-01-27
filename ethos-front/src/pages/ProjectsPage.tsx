import AddProject from "../components/Admin/AddProject";
import EthosBody from "../components/Body";


const ProjectsPage = () => {

    
    return (
        <> 
            <EthosBody nav>
                <AddProject />

                <div>
                    <h6 className="text-6xl text-center">All products here like ecommerce with tags</h6>


                </div>
            </EthosBody>

        </>
    )
}

export default ProjectsPage;
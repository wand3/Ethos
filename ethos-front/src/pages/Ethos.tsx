import EthosBody from "../components/Body";
import ProjectPart from "../components/Projects";
import AddProject from '../components/Admin/AddProject';


const Ethos = () => {

    
    return (
        <> 
            <EthosBody nav>

                <AddProject />
                <ProjectPart />

            </EthosBody>

        </>
    )
}

export default Ethos;
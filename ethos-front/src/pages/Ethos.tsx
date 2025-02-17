import EthosBody from "../components/Body";
import ProjectPart from "../components/Projects";
import GoalsQuotes from "../components/GoalsQuotes";
import HeroArea from "../components/HeroArea";


const Ethos = () => {

    
    return (
        <> 
            <EthosBody nav>
                <HeroArea />
                <GoalsQuotes />
                <ProjectPart projects={[]} />

            </EthosBody>

        </>
    )
}

export default Ethos;
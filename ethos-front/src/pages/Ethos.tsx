import EthosBody from "../components/Body";
import ProjectPart from "../components/Projects";
import GoalsQuotes from "../components/GoalsQuotes";
import HeroArea from "../components/HeroArea";
import MySkills from "../components/SKills";


const Ethos = () => {

    
    return (
        <> 
            <EthosBody nav>
                <HeroArea />
                {/* <GoalsQuotes /> */}
                <MySkills />
                <ProjectPart projects={[]} />

            </EthosBody>

        </>
    )
}

export default Ethos;
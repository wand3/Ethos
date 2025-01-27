import { LineWave } from "react-loader-spinner";

export const SpinnerLineWave = () => {
   

    return (
        <LineWave
            visible={true}
            height="50"
            width="100"
            color="#4fa94d"
            ariaLabel="line-wave-loading"
            wrapperStyle={{}}
            wrapperClass=""
            firstLineColor="#000000"
            middleLineColor=""
            lastLineColor=""
        />
    );
          
}

export default SpinnerLineWave;
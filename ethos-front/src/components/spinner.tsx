import { LineWave } from "react-loader-spinner";

export const SpinnerLineWave = () => {
   

    return (
        <LineWave
            visible={true}
            height="10"
            width="10"
            color="#4fa94d"
            ariaLabel="line-wave-loading"
            wrapperStyle={{}}
            wrapperClass=""
            firstLineColor=""
            middleLineColor=""
            lastLineColor=""
        />
    );
          
}

export default SpinnerLineWave;
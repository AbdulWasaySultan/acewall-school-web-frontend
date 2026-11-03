import BadedChart from "@/CustomComponent/BadedChart";
import React from "react";
import { useParams } from "react-router-dom";

const LoginChartActivity = () => {
  const { id } = useParams();

  return (
    <div>
      <p className="text-xl font-semibold">Login Activity</p>

      <BadedChart userId={id} />
    </div>
  );
};

export default LoginChartActivity;

import Button from "@/components/Button";
import Header from "@/components/Header";
import { useNavigate } from "react-router";
import { Router } from "react-router";

const AllTrips = () => {
  const navigate = useNavigate()
  return (
    <div>
      <div className="flex-between">
        <Header
          title="All trips "
          description="Plan your trips with the help of AI"
        />
        <Button  className="cursor-pointer" onClick={()=>navigate("/create-trips")  } text="Create a trip" />
      </div>
    </div>
  );
};

export default AllTrips;

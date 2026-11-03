import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "@/lib/AxiosInstance";

const CleverSuccess = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axiosInstance.get("auth/me");

                const user = res.data.user;

                if (!user) {
                    navigate("/login");
                    return;
                }

                if (user.role === "student") {
                    navigate("/dashboard");
                } else if (user.role === "instructor") {
                    navigate("/teacher-dashboard");
                } else if (user.role === "admin") {
                    navigate("/admin");
                } else {
                    navigate("/");
                }
            } catch (error) {
                navigate("/login");
            }
        };

        fetchUser();
    }, []);

    return (
        <div className="flex justify-center items-center h-screen">
            <p className="text-lg font-medium">Signing you in via Clever...</p>
        </div>
    );
};

export default CleverSuccess;

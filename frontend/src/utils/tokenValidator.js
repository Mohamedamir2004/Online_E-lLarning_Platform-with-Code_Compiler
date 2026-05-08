export const validateToken = () => {
  const token = localStorage.getItem("token");
  
  if (!token) {
    console.error("No token found in localStorage");
    return null;
  }
  
  try {
    const parsedToken = JSON.parse(token);
    console.log("Token found:", parsedToken ? "Valid" : "Invalid");
    return parsedToken;
  } catch (error) {
    console.error("Error parsing token:", error);
    return null;
  }
};

export const checkUserRole = () => {
  const user = localStorage.getItem("user");
  
  if (!user) {
    console.error("No user data found");
    return null;
  }
  
  try {
    const parsedUser = JSON.parse(user);
    console.log("User role:", parsedUser?.accountType);
    return parsedUser?.accountType;
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
};
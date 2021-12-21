import { sign } from "jsonwebtoken";

const getToken: any = (invalidType: string) => (user: any) => {
  return (
    "Bearer " +
    sign(
      {
        userId: user.id,
        name: user.name,
        role: invalidType == "userRole" ? "invalidRole" : user.role,
      },
      invalidType == "jwtSecret" ? "invalidToken" : process.env.JWT_SECRET,
      {
        issuer: "https://www.netguru.com/",
        subject: `${user.id}`,
        expiresIn: 30 * 60,
      }
    )
  );
};

export default getToken;

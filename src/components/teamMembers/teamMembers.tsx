import React from "react";

interface TeamMemberProps {
  name: string;
  imageUrl: string;
  bio: string;
}

export const TeamMember: React.FC<TeamMemberProps> = ({ name, imageUrl, bio }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col items-center text-center border border-gray-100">
      <div className="relative">
        <img
          src={imageUrl}
          alt={name}
          className="w-36 h-36 rounded-full object-cover border-4 border-green-300 shadow-md mb-4 transition-transform duration-300 hover:scale-105"
        />
      </div>
      <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
      <p className="text-gray-500 text-sm mt-2">{bio}</p>
    </div>
  );
};

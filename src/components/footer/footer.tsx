// import React from 'react'


// export default function login():React.ReactElement {
//   return (
//      <div>
//        <footer className="bg-[#0B0F19] py-4 flex justify-center items-center border-t border-[#1A2236]">
//       <p className="text-white text-sm font-medium">
//         © <span className="text-green-400 font-semibold">NextGen Tech Solution</span> — All Rights Reserved
//       </p>
//     </footer>
//      </div>
//   )
// }
import React from "react";
import { Github, Linkedin, Facebook, Mail } from "lucide-react";

export default function Footer(): React.ReactElement {
  return (
    <footer className="bg-[#0B0F19] border-t border-[#1A2236]">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand Section */}
        <div>
          <h2 className="text-xl font-bold text-white">
            <span className="text-green-400">NextGen</span> Tech Solution
          </h2>
          <p className="mt-4 text-sm text-gray-400 leading-relaxed">
            Building modern web, mobile, IoT, and AI-driven solutions with
            cutting-edge technology.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-3 text-sm text-gray-400">
            <li className="hover:text-green-400 transition">About Us</li>
            <li className="hover:text-green-400 transition">Services</li>
            <li className="hover:text-green-400 transition">Projects</li>
            <li className="hover:text-green-400 transition">Contact</li>
          </ul>
        </div>

        {/* Contact & Socials */}
        <div>
          <h3 className="text-white font-semibold mb-4">Connect With Us</h3>
          <div className="flex items-center gap-4 mb-4">
            <a className="text-gray-400 hover:text-green-400 transition">
              <Github size={20} />
            </a>
            <a className="text-gray-400 hover:text-green-400 transition">
              <Linkedin size={20} />
            </a>
            <a className="text-gray-400 hover:text-green-400 transition">
              <Facebook size={20} />
            </a>
            <a className="text-gray-400 hover:text-green-400 transition">
              <Mail size={20} />
            </a>
          </div>
          <p className="text-sm text-gray-400">info@nextgentechsolution.com</p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#1A2236] py-4 text-center">
        <p className="text-sm text-gray-400">
          © {new Date().getFullYear()} {""}
          <span className="text-green-400 font-semibold">
            NextGen Tech Solution
          </span>{" "}
          — All Rights Reserved
        </p>
      </div>
    </footer>
  );
}

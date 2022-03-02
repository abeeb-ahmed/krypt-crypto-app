import { useState } from "react";
import { HiMenuAlt4 } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";

import logo from "../images/logo.png";

const NavbarItem = ({ title, classProps }) => (
  <li
    className={`mx-3 ${classProps} cursor-pointer justify-center flex items-center`}
  >
    {title}
  </li>
);

const Navbar = () => {
  const [toggled, setToggled] = useState(false);
  return (
    <nav className="w-full flex md:justify-center justify-between items-center p-4">
      <div className="md:flex-[0.5] flex-initial justify-center items-center">
        <img src={logo} alt="logo" className="w-32 cursor-pointer" />
      </div>
      <ul className="text-white md:flex hidden flex-row list-none justify-between items-center">
        {["Market", "Exchange", "Tutorials", "Wallets"].map((item, i) => (
          <NavbarItem title={item} key={item + i} />
        ))}
        <li className="bg-[#2952e3] py-2 px-5 mx-4 rounded-full cursor-pointer hover:bg-[#2546bd]">
          Login
        </li>
      </ul>
      <div className="flex relative">
        {!toggled && (
          <HiMenuAlt4
            fontSize={28}
            className="text-white md:hidden cursor-pointer"
            onClick={() => setToggled(true)}
          />
        )}
        {toggled && (
          <AiOutlineClose
            fontSize={28}
            className="text-white md:hidden cursor-pointer"
            onClick={() => setToggled(false)}
          />
        )}
        {toggled && (
          <ul
            className="z-10 fixed -top-0 -right-2 p-3 w-[70vw] h-screen shadow-2xl md:hidden list-none
            flex flex-col justify-start items-end rounded-md blue-glassmorphism text-white animate-slide-in"
          >
            <li className="text-xl w-full my-2">
              <AiOutlineClose onClick={() => setToggled(false)} />
            </li>
            {["Market", "Exchange", "Tutorials", "Wallets"].map(
              (item, index) => (
                <NavbarItem
                  key={item + index}
                  title={item}
                  classprops="my-2 text-lg"
                />
              )
            )}
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

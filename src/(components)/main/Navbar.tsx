"use client"

import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react'; // Import icons
import { Socials } from '../../../constants';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className='w-full h-[65px] fixed top-0 shadow-lg shadow-[#2A0E61]/50 bg-[#03001417] backdrop-blur-md z-50 px-6 md:px-10'>
      <div className='w-full h-full flex items-center justify-between m-auto'>

        {/* Logo & Title */}
        <Link href="#about-me" className='flex items-center'>
          <Image
            src="/Navlogonewnew.png"
            alt='logo'
            width={40}
            height={40}
            className='cursor-pointer hover:animate-slowspin'
          />
          <span className='font-bold ml-2 text-gray-300'>
            Portfolio
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className='hidden md:flex items-center justify-between w-[480px] border border-[#7042f861] bg-[#03001420] px-4 py-2 rounded-full text-gray-200'>
            <Link href="#about-me" className='cursor-pointer text-left w-1/3'>About me</Link>
            <Link href="#skills" className='cursor-pointer text-center w-1/3'>Skills</Link>
            <Link href="#projects" className='cursor-pointer text-right w-1/3'>Projects</Link>
        </div>


        {/* Social Icons */}
        <div className='hidden md:flex gap-5'>
          {Socials.map((social) => (
            <Link
              key={social.name}
              href={social.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src={social.src}
                alt={social.name}
                width={35}
                height={35}
              />
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setMenuOpen(!menuOpen)} className='md:hidden focus:outline-none'>
          {menuOpen ? <X size={30} color="white" /> : <Menu size={30} color="white" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className='absolute top-[65px] left-0 w-full bg-[#030014] py-4 flex flex-col items-center space-y-4 text-gray-200 md:hidden'>
          <Link href="#about-me" onClick={() => setMenuOpen(false)} className='cursor-pointer'>About me</Link>
          <Link href="#skills" onClick={() => setMenuOpen(false)} className='cursor-pointer'>Skills</Link>
          <Link href="#projects" onClick={() => setMenuOpen(false)} className='cursor-pointer'>Projects</Link>
          {/* Social Icons in Mobile View */}
          <div className='flex gap-5'>
            {Socials.map((social) => (
              <Link
                key={social.name}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
              >
                <Image
                  src={social.src}
                  alt={social.name}
                  width={30}
                  height={30}
                />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;


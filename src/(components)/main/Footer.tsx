import React from 'react';
import Image from 'next/image';
import Link from 'next/link'; // Make sure to import Link from 'next/link'
import { Socials } from '../../../constants'; // Ensure Socials array is imported
import { RxInstagramLogo } from 'react-icons/rx';
import { FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <div className='w-full h-full bg-transparent text-gray-200 shadow-lg p-[15px] z-50'>
      <div className='w-full flex flex-col items-center justify-center m-auto'>
        <div className='w-full h-full flex flex-row items-center justify-around flex-wrap'>
          {/* Community Section */}
          <div className='min-w-[200px] h-auto flex flex-col items-center justify-start'>
            <div className='font-bold text-[16px]'>Community</div>
            <div className="flex flex-col items-center">
              {Socials.map((social) => (
                <Link
                  key={social.name}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-row items-center my-[15px] cursor-pointer"
                  style={{ zIndex: 1 }} // Ensure it's above other elements
                >
                  <Image
                    src={social.src}
                    alt={social.name}
                    width={30}
                    height={30}
                    className="cursor-pointer" // Ensure image is clickable
                  />
                  <span className='text-[15px] ml-[6px]'>{social.name}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className='min-w-[200px] h-auto flex flex-col items-center justify-start'>
            <div className='font-bold text-[16px]'>Social Media</div>
                <a
                href="https://youtube.com/@message_to_heart_mth?si=fQ22GipKSh8qp75y"
                target="_blank"
                rel="noopener noreferrer"
                className='flex flex-row items-center my-[15px] cursor-pointer'
                >
                <FaYoutube />
                <span className='text-[15px] ml-[6px]'>Youtube</span>
                </a>
                <a
                href="https://www.instagram.com/janaka_nupehewage/"
                target="_blank"
                rel="noopener noreferrer"
                className='flex flex-row items-center my-[15px] cursor-pointer'
                >
                <RxInstagramLogo />
                <span className='text-[15px] ml-[6px]'>Instagram</span>
                </a>
            </div>

          {/* About Section */}
          <div className='min-w-[200px] h-auto flex flex-col items-center justify-start'>
            <div className='font-bold text-[16px]'>About</div>
            
            <a  href="https://www.linkedin.com/in/janaka-nupehewage-42024827a/"
                target="_blank"
                rel="noopener noreferrer" 
                className='flex flex-row items-center my-[15px] cursor-pointer'>
              <span className='text-[15px] ml-[6px]'>Follow me on LinkedIn</span>
            </a>
            
            <p className='flex flex-row items-center my-[15px] cursor-pointer'>
              <span className='text-[15px] ml-[6px]'>janakanupehewage02@gmail.com</span>
            </p>
          </div>
        </div>
        <div className='mt-[10px] mb-[20px] text-[15px] text-center'>
          &copy; Janaka Nupehewage Portfolio 2025 Inc. All Rights Reserved.
        </div>
      </div>
    </div>
  );
};

export default Footer;

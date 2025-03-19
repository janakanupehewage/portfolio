import Skills from '@/(components)/main/Skills';
import Hero from '../(components)/main/Hero';
import Encryption from '@/(components)/main/Encryption';
import Projects from '@/(components)/main/Projects';
import Navbar from '@/(components)/main/Navbar';
import StarsCanvas from '@/(components)/main/StarBackground';
import Footer from '@/(components)/main/Footer';

export default function Home() {
  return (
    <main className='h-full w-full'>
      <div className='flex flex-col  gap-20'>
       <Navbar />
       <StarsCanvas/>
        <Hero/>
        <Skills/>
        <Encryption/>
        <Projects/>
        <Footer/>
      </div>
    </main>
  );
}

import React from 'react';
import upnote from '../../assets/upnote.png';

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-10 border-t border-secondary-200">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col items-center justify-center text-center gap-2">
        <div className="flex items-center space-x-2">
          <img src={upnote} alt="UPNote" className="h-5 w-5 rounded-sm" />
          <span className="text-sm font-medium text-secondary-700">UPNote • Sistema de Notas</span>
        </div>
        <div className="flex items-center justify-center space-x-4 text-xs text-secondary-500">
          <a href="#" className="hover:text-secondary-700">Soporte</a>
          <span>•</span>
          <a href="#" className="hover:text-secondary-700">Privacidad</a>
          <span>•</span>
          <a href="#" className="hover:text-secondary-700">Términos</a>
        </div>
        <div className="text-xs text-secondary-500">© {year} UPNote</div>
      </div>
    </footer>
  );
};

export default Footer;

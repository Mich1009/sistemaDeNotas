import { useEffect } from 'react';
import { useLogoContext } from '../contexts/LogoContext';

const DynamicFavicon = () => {
    const { logoUrl } = useLogoContext();

    useEffect(() => {
        if (logoUrl) {
            // Buscar el elemento link del favicon existente
            let favicon = document.querySelector('link[rel="icon"]');

            if (!favicon) {
                // Si no existe, crear uno nuevo
                favicon = document.createElement('link');
                favicon.rel = 'icon';
                document.head.appendChild(favicon);
            }

            // Actualizar el href del favicon
            favicon.href = logoUrl;

            // También actualizar otros tipos de iconos si existen
            const appleTouchIcon = document.querySelector('link[rel="apple-touch-icon"]');
            if (appleTouchIcon) {
                appleTouchIcon.href = logoUrl;
            }

            // Actualizar manifest icon si existe
            const manifestLink = document.querySelector('link[rel="manifest"]');
            if (manifestLink) {
                // Aquí podrías actualizar el manifest dinámicamente si es necesario
                console.log('Manifest encontrado, considera actualizar los iconos del manifest');
            }
        }
    }, [logoUrl]);

    // Este componente no renderiza nada visible
    return null;
};

export default DynamicFavicon;
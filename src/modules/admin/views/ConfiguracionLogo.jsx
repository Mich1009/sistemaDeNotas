import { useState, useEffect } from 'react';
import { configService } from '../services/configService';
import { toast } from 'react-hot-toast';
import { Image, Upload, Save } from 'lucide-react';

const ConfiguracionLogo = () => {
  const [logoUrl, setLogoUrl] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const data = await configService.getLogoConfig();
        if (data && data.value) {
          setLogoUrl(data.value);
        }
      } catch (error) {
        console.error("Error al cargar el logo:", error);
        toast.error("Error al cargar la configuración del logo");
      }
    };
    
    fetchLogo();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await configService.updateLogoConfig({
        value: logoUrl,
        description: "Logo mostrado en la página de login"
      });
      
      toast.success("Logo actualizado correctamente");
    } catch (error) {
      console.error("Error al actualizar el logo:", error);
      toast.error("Error al actualizar el logo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-bold flex items-center">
            <Image className="w-5 h-5 mr-2" />
            Configuración del Logo
          </h2>
        </div>
        
        <div className="card-body">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  URL del Logo
                </label>
                <input
                  type="text"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  className="input-field"
                  placeholder="Ingrese la URL del logo"
                  required
                />
                <p className="text-xs text-secondary-500 mt-1">
                  Ingrese la URL completa de la imagen o la ruta relativa (ej: /assets/logo.png)
                </p>
              </div>
              
              <div className="flex flex-col items-center justify-center">
                <div className="mb-2 text-sm font-medium text-secondary-700">
                  Vista previa
                </div>
                <div className="border border-secondary-200 rounded-lg p-4 flex items-center justify-center">
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt="Logo Preview"
                      className="max-w-full max-h-32 object-contain"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/assets/upnote.png';
                        toast.error("No se pudo cargar la imagen");
                      }}
                    />
                  ) : (
                    <div className="text-secondary-400 text-sm">
                      Sin imagen
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                ) : (
                  <Save className="w-5 h-5 mr-2" />
                )}
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConfiguracionLogo;
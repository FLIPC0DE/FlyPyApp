import BarraDeNavegacionLateral from "./BarraDeNavegacionLateral";
import BarraDeNavegacionSuperior from "./BarraDeNavegacionSuperior";

interface LayoutProps {
  children: React.ReactNode;
}

const BarrasDeNavegacion: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-[#0f172a]">
      <BarraDeNavegacionLateral />
      <div className="flex-1 flex flex-col">
        <BarraDeNavegacionSuperior />
        <main className="flex-1 p-8 overflow-y-auto text-gray-200">{children}</main>
      </div>
    </div>
  );
};

export default BarrasDeNavegacion;

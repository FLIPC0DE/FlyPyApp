const BarraDeNavegacionSuperior = () => { 
    return ( 
        <header className="flex justify-between items-center px-6 py-4 bg-[#1e293b] border-b border-gray-700"> 
            <nav className="flex space-x-6 items-center text-gray-300"> 
                <a href="#" className="hover:text-white font-medium"> 
                    Dashboard 
                </a> 
                <a href="#" className="hover:text-white font-medium"> 
                    My Courses 
                </a> <a href="#" className="hover:text-white font-medium"> 
                    Create 
                </a> 
                <a href="#" className="hover:text-white font-medium"> 
                    Analytics 
                </a> 
            </nav> 
            <div className="flex items-center space-x-4"> 
                <input type="text" placeholder="Search courses, topics, people" className="bg-[#0f172a] text-gray-200 px-3 py-2 rounded-lg w-64 focus:outline-none focus:ring focus:ring-indigo-600" /> 
                <img src="https://via.placeholder.com/32" alt="User Avatar" className="w-8 h-8 rounded-full border border-gray-500" /> 
            </div> 
        </header> 
    ); 
}; 
export default BarraDeNavegacionSuperior;
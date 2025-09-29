import React, { useState } from 'react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import Announcements from '../../components/Announcements'

function TeacherAnnouncements() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    
    // Date formatting logic
    const now = new Date();
    const date = now.getDate();
    const month = now.toLocaleString("default", { month: "long" });
    const day = now.toLocaleString("default", { weekday: "long" });
    const year = now.getFullYear();
    
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>
            
            <div className='flex flex-1 bg-gray-100 overflow-hidden'>
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>
                
                {/* Main Content Area: flex-1 takes remaining width/height. p-4/sm:p-6 defines mobile padding. */}
                <main className="flex-1 flex flex-col p-4 sm:p-6 overflow-y-auto"> 
                    
                    {/* NEW ALIGNMENT WRAPPER: Handles consistent desktop padding/alignment. */}
                    {/* On large screens, we apply lg:px-0 because we rely on the main's padding. */}
                    <div className="w-full"> 
                        
                        {/* Header Section */}
                        <section className="mb-4 sm:mb-6">
                            <h1 className="text-3xl sm:text-4xl lg:text-4xl font-bold text-black mb-1">
                                Announcements
                            </h1>
                            <p className="text-gray-600 text-base sm:text-lg">
                                {day}, {month} {date}, {year}
                            </p>
                        </section>
                        
                        {/* Announcement Input Section: w-full now takes the full width of the main content area. */}
                        <section className="p-0 mt-2 w-full"> 
                            <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-[6px_6px_20px_rgba(0,0,0,0.55)] border border-gray-200 mb-6 w-full">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    {/* Teacher Initial Circle */}
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-white text-sm font-semibold">T</span>
                                    </div>
                                    
                                    {/* Input Field */}
                                    <input
                                        type="text"
                                        placeholder="Make an announcement to your class"
                                        className="flex-1 px-2 sm:px-4 py-2 sm:py-3 border-none outline-none text-gray-700 placeholder-gray-500 text-sm sm:text-base"
                                        onFocus={(e) => e.target.classList.add('ring-2', 'ring-gray-300', 'rounded-lg')}
                                        onBlur={(e) => e.target.classList.remove('ring-2', 'ring-gray-300', 'rounded-lg')}
                                    />
                                    
                                    {/* Send Button */}
                                    <button className="p-1 sm:p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-gray-700">
                                            <path d="M2 21L23 12L2 3V10L17 12L2 14V21Z" fill="currentColor"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </section>
                        
                        {/* Announcements List Section: w-full takes the full width. */}
                        <section className="flex-1 mt-1 sm:mt-4 p-0 w-full">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">Recent Announcements</h2>
                            <Announcements />
                        </section>
                    
                    </div>
                </main>
            </div>
        </div>
    )
}

export default TeacherAnnouncements
export default function Modal({show, onClose}) {
    
    const handleSubmit = (e) => {
        e.preventDefault()
    
        console.log("submitted");
        let title = e.target.title.value;
        let description = e.target.description.value;
        let location = e.target.location.value;
        
        console.log('Form submitted:', { title, description, location }); 
    }


    if (show==false) {
        console.log("Modal not open!")
        return null;
    }
    else {
        console.log(String(show));
        return (
            <div className="fixed top-0 left-0 w-100% h-100% bg-opacity-50 bg-white flex justify-center items-center">
                <h1>Add a Mission!</h1>
                <form method="post" className="flex flex-col gap-1" onSubmit={handleSubmit}>
                    <input
                        className="bg-white text-gray-500"
                        id="title"
                        name="title"
                        placeholder="Title"
                    />
                    <input
                        className="bg-white text-gray-500"
                        id="description"
                        name="description"
                        placeholder="Description"
                    />
                    <input
                        className="bg-white text-gray-500"
                        id="location"
                        name="location"
                        placeholder="Location"
                    />
                    <button
                        className="bg-gray-500 text-white"
                        type="submit"
                    >Add!</button>
                </form>
                
            </div>
        )
    }
}
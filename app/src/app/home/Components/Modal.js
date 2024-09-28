export default function Modal({show, onClose, setMission}) {
    
    const handleSubmit = (e) => {
        e.preventDefault();
    
        console.log("submitted");
        let title = e.target.title.value;
        let description = e.target.description.value;
        let location = e.target.location.value;
        
        setMission({title, description, location});

        onClose();

    }


    if (show==false) {
        return null;
    }
    else {
        console.log(String(show));
        return (
            <div className="fixed top-0 left-0 w-100% h-100% bg-opacity-50 bg-white flex justify-center items-center">
                <h1>Add a Mission!</h1>
                <form method="post" action="/home" className="flex flex-col gap-1" onSubmit={(e)=>handleSubmit(e)}>
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
                        className="bg-gray-500 text-white">
                            Add!
                    </button>
                </form>
                
            </div>
        )
    }
}
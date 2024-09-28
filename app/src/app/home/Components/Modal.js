export default function Modal({show, onClose}) {
    console.log(show);
    if (show==false) {
        return null;
    }
    else {
        return (
            <div className="fixed top-0 left-0 w-100% h-100% bg-opacity-50 bg-white flex justify-center items-center">
                <h1>Add a Mission!</h1>
                <form action="/" className="flex flex-col gap-1">
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
                        onClick={onClose}
                    >Close</button>
                </form>
                
            </div>
        )
    }
}
export default function AddMission(v) {

    return (
        <div className="m-5">
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
                <input
                    className="bg-gray-500 text-white"
                    type="submit"
                
                />
            </form>
            
        </div>
    )
}
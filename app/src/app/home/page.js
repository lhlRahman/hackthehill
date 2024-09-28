import AddMission from './Components/addMission.js';
import EditMission from './Components/editMission.js';

export default function Home() {
    return (
<<<<<<< HEAD
      <div className="flex flex-col center-items ml-64 mr-64 min-h-screen">
        <h1>let's get some work done (woo)</h1>

        <h2>Current Mission:</h2>

        <div className="border-red-500 border-4 w-full h-40">display something!</div>

          <div>
            {/* Display all missions */}
          </div>
          <div>
            {/* Add a missison */}
            <AddMission></AddMission>
          </div>
          <div>
            {/* Cancel a mission */}
            <EditMission></EditMission>
          </div>
=======
      <div className="flex flex-row center-items">
        <h1>Hello Test!</h1>
>>>>>>> 6ef1b8f8df38201f3c560b398111de544e6de7bd
      </div>
    );
  }
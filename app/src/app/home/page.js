import AddMission from './Components/addMission.js';
import EditMission from './Components/editMission.js';

export default function Home() {
    return (
      <div className="min-h-screen">
        <div className="flex justify-between ml-64 mr-64 pt-8 h-full">
          <h1>let's get some work done (woo)</h1>
            <div>
              {/* Add a missison */}
                <AddMission></AddMission>
              </div>
          </div>

          <div className="flex flex-col center-items ml-64 mr-64 mt-16">
            <h2>Current Mission:</h2>

            <div className=" border-red-500 border-4 w-full h-40">display something!</div>

              <div>
                {/* Display all missions */}
              </div>
              <div>
                {/* Cancel a mission */}
                <EditMission></EditMission>
              </div>
          </div>
      </div>

    );
  }
import AddMission from './Components/addMission.js';
import EditMission from './Components/editMission.js';

export default function Home() {
    return (
      <div className="flex flex-col center-items ml-64 mr-64 min-h-screen">
        <h1>let's get some work done (woo)</h1>

        <h2>Current Mission:</h2>

        <div className="border-red-500 border-4 w-full h-40">display something!</div>

          <div>
            {/* Display all missions */}
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
          <div>
            {/* Cancel a mission */}
            <EditMission></EditMission>
          </div>
      </div>

    );
  }
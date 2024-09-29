// textTo3DController.js

import axios from "axios";
import { configDotenv } from "dotenv";
import axiosRetry from 'axios-retry';

configDotenv();

// Set your Meshy API key here
const MESHY_API_KEY = process.env.MESHY_API_KEY;

console.log('Initializing textTo3DController with Meshy API Key:', MESHY_API_KEY ? 'Loaded' : 'Not Loaded');

// Create an axios instance with timeout and retry logic
const axiosInstance = axios.create({
    timeout: 1000 * 300, // 300 seconds timeout
});

axiosRetry(axiosInstance, {
    retries: 3,
    retryDelay: axiosRetry.exponentialDelay,
    retryCondition: (error) => {
        const shouldRetry = axiosRetry.isNetworkOrIdempotentRequestError(error) || (error.response && error.response.status >= 500);
        console.log(`axiosRetry: Determining if request should be retried. Should Retry: ${shouldRetry}`);
        return shouldRetry;
    },
});

console.log('Axios instance created with retry logic.');

// Function to create a Text to 3D Preview Task
export const createTextTo3DPreviewTask = async (prompt) => {
    console.log('createTextTo3DPreviewTask: Initiating preview task creation.');
    const payload = {
        mode: 'preview',
        prompt: prompt || 'a monster mask',
        negative_prompt: 'low quality, low resolution, low poly, ugly',
        art_style: 'realistic',
    };
    console.log('createTextTo3DPreviewTask: Payload prepared:', payload);

    const options = {
        headers: { Authorization: `Bearer ${MESHY_API_KEY}` },
    };
    console.log('createTextTo3DPreviewTask: Axios options set with Authorization header.');

    try {
        console.log('createTextTo3DPreviewTask: Sending POST request to Meshy API for preview task.');
        const response = await axiosInstance.post('https://api.meshy.ai/v2/text-to-3d', payload, options);
        console.log('createTextTo3DPreviewTask: Received response:', response.data);

        // Ensure that response.data.result is the task ID string
        const taskId = typeof response.data.result === 'string' ? response.data.result : response.data.result.id;
        console.log(`createTextTo3DPreviewTask: Preview task created with ID: ${taskId}`);
        return taskId;
    } catch (error) {
        console.error('createTextTo3DPreviewTask: Error creating preview task:', error);
        let errorMsg = 'Unknown error';
        if (error.response && error.response.data) {
            errorMsg = JSON.stringify(error.response.data);
        } else if (error.message) {
            errorMsg = error.message;
        }
        throw new Error(`Error creating preview task: ${errorMsg}`);
    }
};

// Function to create a Text to 3D Refine Task
export const createTextTo3DRefineTask = async (previewTaskId) => {
    console.log('createTextTo3DRefineTask: Initiating refine task creation.');
    const payload = {
        mode: 'refine',
        preview_task_id: previewTaskId,
    };
    console.log('createTextTo3DRefineTask: Payload prepared:', payload);

    const options = {
        headers: { Authorization: `Bearer ${MESHY_API_KEY}` },
    };
    console.log('createTextTo3DRefineTask: Axios options set with Authorization header.');

    try {
        console.log('createTextTo3DRefineTask: Sending POST request to Meshy API for refine task.');
        const response = await axiosInstance.post('https://api.meshy.ai/v2/text-to-3d', payload, options);
        console.log('createTextTo3DRefineTask: Received response:', response.data);

        // Ensure that response.data.result is the task ID string
        const taskId = typeof response.data.result === 'string' ? response.data.result : response.data.result.id;
        console.log(`createTextTo3DRefineTask: Refine task created with ID: ${taskId}`);
        return taskId;
    } catch (error) {
        console.error('createTextTo3DRefineTask: Error creating refine task:', error);
        let errorMsg = 'Unknown error';
        if (error.response && error.response.data) {
            errorMsg = JSON.stringify(error.response.data);
        } else if (error.message) {
            errorMsg = error.message;
        }
        throw new Error(`Error creating refine task: ${errorMsg}`);
    }
};

// Function to retrieve the final task and model links
export const getTextTo3DTask = async (taskId) => {
    console.log('getTextTo3DTask: Retrieving task data for Task ID:', taskId);
    const options = {
        headers: { Authorization: `Bearer ${MESHY_API_KEY}` },
    };

    try {
        console.log(`getTextTo3DTask: Sending GET request to Meshy API for Task ID: ${taskId}`);
        const response = await axiosInstance.get(`https://api.meshy.ai/v2/text-to-3d/${taskId}`, options);
        console.log('getTextTo3DTask: Received response:', response.data);
        return response.data;
    } catch (error) {
        console.error('getTextTo3DTask: Error retrieving 3D task:', error);
        let errorMsg = 'Unknown error';
        if (error.response && error.response.data) {
            errorMsg = JSON.stringify(error.response.data);
        } else if (error.message) {
            errorMsg = error.message;
        }
        throw new Error(`Error retrieving 3D task: ${errorMsg}`);
    }
};

// Route handler to retrieve task data
export const getTextTo3DTaskHandler = async (req, res) => {
    const taskId = req.params.id;
    console.log('getTextTo3DTaskHandler: Received taskId:', taskId);
    try {
        console.log(`getTextTo3DTaskHandler: Fetching task data for Task ID: ${taskId}`);
        const taskData = await getTextTo3DTask(taskId);
        console.log('getTextTo3DTaskHandler: Retrieved task data:', taskData);
        return res.status(200).json(taskData);
    } catch (error) {
        console.error('getTextTo3DTaskHandler: Error retrieving 3D task:', error.message);
        return res.status(500).json({ error: error.message });
    }
};

// Combined function to create a preview task, refine it, and return the final model link
export const createTextTo3DModel = async (req, res) => {
    const { prompt } = req.body; // Accept a prompt from the request body
    console.log('createTextTo3DModel: Received request to create 3D model with prompt:', prompt);
    try {
        // Step 1: Create a Preview Task
        console.log('createTextTo3DModel: Step 1 - Creating preview task.');
        const previewTaskId = await createTextTo3DPreviewTask(prompt);
        console.log(`createTextTo3DModel: Preview task created with ID: ${previewTaskId}`);

        // Step 2: Wait for Preview Task to Complete
        console.log('createTextTo3DModel: Step 2 - Waiting for preview task to complete.');
        await waitForTaskToComplete(previewTaskId);
        console.log(`createTextTo3DModel: Preview task ${previewTaskId} completed.`);

        // Step 3: Create a Refine Task using the Preview Task ID
        console.log('createTextTo3DModel: Step 3 - Creating refine task.');
        const refineTaskId = await createTextTo3DRefineTask(previewTaskId);
        console.log(`createTextTo3DModel: Refine task created with ID: ${refineTaskId}`);

        // Step 4: Wait for Refine Task to Complete
        console.log('createTextTo3DModel: Step 4 - Waiting for refine task to complete.');
        await waitForTaskToComplete(refineTaskId);
        console.log(`createTextTo3DModel: Refine task ${refineTaskId} completed.`);

        // Step 5: Retrieve the final model using the refine task ID
        console.log('createTextTo3DModel: Step 5 - Retrieving final model data.');
        const finalTaskData = await getTextTo3DTask(refineTaskId);

        const modelUrls = finalTaskData;
        if (modelUrls) {
            console.log('createTextTo3DModel: 3D model generation successful. Model URLs:', modelUrls);
            // Return the link to the final GLB model
            return res.status(200).json({
                message: '3D model generation successful',
                model_link: modelUrls, // Link to the final GLB model
            });
        } else {
            console.warn('createTextTo3DModel: 3D model task did not produce a model.');
            return res.status(200).json({
                message: '3D model task did not produce a model',
                status: finalTaskData.status,
            });
        }
    } catch (error) {
        console.error('createTextTo3DModel: Error during 3D model creation:', error.message);
        return res.status(500).json({ error: error.message });
    }
};

// Function to wait for a task to complete
const waitForTaskToComplete = async (taskId) => {
    console.log(`waitForTaskToComplete: Waiting for Task ID ${taskId} to complete.`);
    const maxAttempts = 60; // Adjust as needed
    const delay = 5000; // 5 seconds
    let attempts = 0;

    while (attempts < maxAttempts) {
        console.log(`waitForTaskToComplete: Attempt ${attempts + 1} to check status for Task ID: ${taskId}`);
        const status = await getTaskStatus(taskId);
        console.log(`waitForTaskToComplete: Task ${taskId} status: ${status}`);
        if (status === 'SUCCEEDED') {
            console.log(`waitForTaskToComplete: Task ${taskId} succeeded.`);
            return;
        } else if (status === 'FAILED') {
            console.error(`waitForTaskToComplete: Task ${taskId} failed.`);
            throw new Error(`Task ${taskId} failed.`);
        }
        console.log(`waitForTaskToComplete: Task ${taskId} is still in progress. Waiting for ${delay / 1000} seconds before next check.`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        attempts++;
    }
    console.error(`waitForTaskToComplete: Task ${taskId} did not complete within the expected time.`);
    throw new Error(`Task ${taskId} did not complete within the expected time.`);
};

// Function to check the status of a task
const getTaskStatus = async (taskId) => {
    console.log(`getTaskStatus: Checking status for Task ID: ${taskId}`);
    const options = {
        headers: { Authorization: `Bearer ${MESHY_API_KEY}` },
    };

    try {
        console.log(`getTaskStatus: Sending GET request to Meshy API for Task ID: ${taskId}`);
        const response = await axiosInstance.get(`https://api.meshy.ai/v2/text-to-3d/${taskId}`, options);
        console.log('getTaskStatus: Received response:', response.data);
        return response.data.status;
    } catch (error) {
        console.error('getTaskStatus: Error retrieving task status:', error);
        let errorMsg = 'Unknown error';
        if (error.response && error.response.data) {
            errorMsg = JSON.stringify(error.response.data);
        } else if (error.message) {
            errorMsg = error.message;
        }
        throw new Error(`Error retrieving task status: ${errorMsg}`);
    }
};

// textTo3DController.js

import axios from "axios";
import { configDotenv } from "dotenv";
import axiosRetry from 'axios-retry';

configDotenv();

// Set your Meshy API key here
const MESHY_API_KEY = process.env.MESHY_API_KEY;

// Create an axios instance with timeout and retry logic
const axiosInstance = axios.create({
    timeout: 1000 * 300, // 120 seconds timeout
});

axiosRetry(axiosInstance, {
    retries: 3,
    retryDelay: axiosRetry.exponentialDelay,
    retryCondition: (error) => {
        // Retry on network errors or 5xx responses
        return axiosRetry.isNetworkOrIdempotentRequestError(error) || error.response.status >= 500;
    },
});

// Function to create a Text to 3D Preview Task
export const createTextTo3DPreviewTask = async (prompt) => {
    const payload = {
        mode: 'preview',
        prompt: prompt || 'a monster mask',
        negative_prompt: 'low quality, low resolution, low poly, ugly',
        art_style: 'realistic',
    };

    const options = {
        headers: { Authorization: `Bearer ${MESHY_API_KEY}` },
    };

    try {
        const response = await axiosInstance.post('https://api.meshy.ai/v2/text-to-3d', payload, options);
        console.log('Preview task creation response:', response.data); // For debugging
        // Ensure that response.data.result is the task ID string
        return typeof response.data.result === 'string' ? response.data.result : response.data.result.id;
    } catch (error) {
        console.error('Error creating preview task:', error);
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
    const payload = {
        mode: 'refine',
        preview_task_id: previewTaskId,
    };

    const options = {
        headers: { Authorization: `Bearer ${MESHY_API_KEY}` },
    };

    try {
        const response = await axiosInstance.post('https://api.meshy.ai/v2/text-to-3d', payload, options);
        console.log('Refine task creation response:', response.data); // For debugging
        // Ensure that response.data.result is the task ID string
        return typeof response.data.result === 'string' ? response.data.result : response.data.result.id;
    } catch (error) {
        console.error('Error creating refine task:', error);
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
    const options = {
        headers: { Authorization: `Bearer ${MESHY_API_KEY}` },
    };

    try {
        console.log('Fetching task with ID:', taskId); // For debugging
        const response = await axiosInstance.get(`https://api.meshy.ai/v2/text-to-3d/${taskId}`, options);
        return response.data;
    } catch (error) {
        console.error('Error retrieving 3D task:', error);
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
    console.log('Received taskId:', taskId); // For debugging
    try {
        const taskData = await getTextTo3DTask(taskId);
        return res.status(200).json(taskData);
    } catch (error) {
        console.error('Error retrieving 3D task:', error.message);
        return res.status(500).json({ error: error.message });
    }
};

// Combined function to create a preview task, refine it, and return the final model link
export const createTextTo3DModel = async (req, res) => {
    const { prompt } = req.body; // Accept a prompt from the request body
    try {
        // Step 1: Create a Preview Task
        const previewTaskId = await createTextTo3DPreviewTask(prompt);
        console.log(`Preview task created with ID: ${previewTaskId}`);

        // Step 2: Wait for Preview Task to Complete
        await waitForTaskToComplete(previewTaskId);
        console.log(`Preview task ${previewTaskId} completed.`);

        // Step 3: Create a Refine Task using the Preview Task ID
        const refineTaskId = await createTextTo3DRefineTask(previewTaskId);
        console.log(`Refine task created with ID: ${refineTaskId}`);

        // Step 4: Wait for Refine Task to Complete
        await waitForTaskToComplete(refineTaskId);
        console.log(`Refine task ${refineTaskId} completed.`);

        // Step 5: Retrieve the final model using the refine task ID
        const finalTaskData = await getTextTo3DTask(refineTaskId);

        const modelUrls = finalTaskData.model_urls;
        if (modelUrls) {
            // Return the link to the final GLB model
            return res.status(200).json({
                message: '3D model generation successful',
                model_link: modelUrls, // Link to the final GLB model
            });
        } else {
            return res.status(200).json({
                message: '3D model task did not produce a model',
                status: finalTaskData.status,
            });
        }
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: error.message });
    }
};

// Function to wait for a task to complete
const waitForTaskToComplete = async (taskId) => {
    const maxAttempts = 60; // Adjust as needed
    const delay = 5000; // 5 seconds
    let attempts = 0;

    while (attempts < maxAttempts) {
        const status = await getTaskStatus(taskId);
        console.log(`Task ${taskId} status: ${status}`);
        if (status === 'SUCCEEDED') {
            return;
        } else if (status === 'FAILED') {
            throw new Error(`Task ${taskId} failed.`);
        }
        await new Promise((resolve) => setTimeout(resolve, delay));
        attempts++;
    }
    throw new Error(`Task ${taskId} did not complete within the expected time.`);
};

// Function to check the status of a task
const getTaskStatus = async (taskId) => {
    const options = {
        headers: { Authorization: `Bearer ${MESHY_API_KEY}` },
    };

    try {
        const response = await axiosInstance.get(`https://api.meshy.ai/v2/text-to-3d/${taskId}`, options);
        return response.data.status;
    } catch (error) {
        console.error('Error retrieving task status:', error);
        let errorMsg = 'Unknown error';
        if (error.response && error.response.data) {
            errorMsg = JSON.stringify(error.response.data);
        } else if (error.message) {
            errorMsg = error.message;
        }
        throw new Error(`Error retrieving task status: ${errorMsg}`);
    }
};

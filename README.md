# AIrena: A Visual, Self-Contained Reinforcement Learning Laboratory

AIrena is an integrated software package designed to demystify Reinforcement Learning (RL) by providing a real-time, 3D visual interface for training AI agents. It eliminates the complex configuration typically associated with RL experiments by packaging the AI backend, the 3D simulation environment, and the communication layer into a single, self-contained application launched via a simple automation script.

This project bridges the gap between abstract numerical training data and intuitive visual feedback, allowing users to observe a Proximal Policy Optimization (PPO) agent learn to navigate procedurally generated dungeons in real-time.

## Download and Installation

**Important:** You do not need to clone the repository code if you simply want to run the application.

Please download the latest self-contained package from the **Releases** section of this repository.

1. Navigate to the "Releases" tab on the right side of this page.
2. Download the `.zip` file for the latest version.
3. Extract the contents to a folder on your local machine.

## Prerequisites

To run the application, your system must have the following runtimes installed:

* **Python 3.9 or higher**: Required for the AI backend.
* **Node.js 16 or higher**: Required for the web server and visualization frontend.

## Quick Start

The application is designed for a "one-click" launch experience.

1. Open the folder where you extracted the project files.
2. Locate and double-click the `start-windows.bat` script.
3. The script will automatically:
   * Check for Python and Node.js installations.
   * Install all necessary Python dependencies (via `pip`).
   * Install all necessary JavaScript dependencies (via `npm`).
   * Launch the Python "Brain" server in a new terminal window.
   * Launch the Vite "Arena" server in a new terminal window.
   * Open your default web browser to `http://localhost:3000`.

Once the browser opens, the connection will be established, and the training session will begin automatically. You will see the agent attempting to navigate the maze.

## System Architecture

The project follows a decoupled client-server architecture composed of three main modules:

1. **The Launcher (`start-windows.bat`):** A Windows batch script that acts as the system controller. It manages dependency installation and process lifecycle management for both servers.
2. **The AI Brain (Python Backend):** Utilizes `Stable Baselines3` to implement the PPO algorithm. It processes sensory input (observations) and determines the optimal move (actions). It communicates via a WebSocket server on port 8765.
3. **The 3D Arena (JavaScript Frontend):** Built with `Three.js` and `Ammo.js` (physics). It renders the environment, handles collision detection, and generates procedural dungeons using the "Rooms and Mazes" algorithm. It acts as a WebSocket client connected to the Python backend.

## Project Structure

* `start-windows.bat` - The main entry point and automation script.
* `training/`
  * `train_maze_solver.py` - The core Python script containing the RL agent and WebSocket server.
  * `models/` - Directory where trained model checkpoints (`.zip`) are saved.
  * `logs/` - Directory where training metrics (`.csv`) are saved.
* `game/`
  * `src/main.js` - The main entry point for the 3D visualization logic.
  * `index.html` - The HTML container for the 3D canvas.

## Outputs and Analysis

The system produces persistent data for post-training analysis. These files are generated automatically in the `training/` directory.

* **Model Checkpoints:** Saved in `training/models/`. These `.zip` files contain the neural network weights of the agent at various timesteps.
* **Training Logs:** Saved in `training/logs/training_logs.csv`. This file contains detailed metrics including:
  * `ep_rew_mean`: Average reward per episode (the primary metric for success).
  * `ep_len_mean`: Average length of an episode.
  * `loss`: The internal loss value of the neural network.

## Troubleshooting

* **Terminals close immediately:** Ensure you have Python and Node.js installed and added to your system PATH.
* **Browser stays on "Connecting...":** Check the Python terminal window. If it shows an error, there may be a missing library. Try running `pip install -r requirements.txt` manually in the `training` folder.
* **Performance issues:** Real-time training is computationally intensive. Ensure hardware acceleration is enabled in your browser settings.

## Technologies Used

* **Language:** Python, JavaScript
* **RL Library:** Stable Baselines3 (PyTorch)
* **Visualization:** Three.js
* **Physics:** Ammo.js
* **Communication:** WebSockets
* **Build Tool:** Vite

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

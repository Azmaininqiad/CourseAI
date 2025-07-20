```markdown
# Module 7: Robotic Software Engineer - Core Development Concepts

## Learning Objectives
By the end of this module, you will be able to:
- Understand the fundamentals of robotic software architecture
- Implement basic robotic perception using sensor data
- Design simple control algorithms for robotic systems
- Apply error handling and debugging techniques in robotics

## Introduction
![Futuristic Robotic System Hierarchy](https://hooshmand.net/wp-content/uploads/2024/07/futuristic-diverse-organization-hierarchy-illustration-jpg-768x439.jpg)

Welcome to the heart of robotic software engineering! In this module, we'll explore the core concepts that transform code into intelligent robotic behaviors. Whether you're working on autonomous drones or warehouse robots, these principles form the foundation of all robotic systems. We'll bridge theory with hands-on practice using Python and ROS (Robot Operating System), the industry-standard framework.

---

## Topic 7.1: Robotic Software Architecture

### What Makes Robotic Software Unique?
Robotic systems are **reactive, real-time, and uncertain**. Unlike standard software:
- They interact with the physical world
- Must process continuous sensor data streams
- Require safety-critical error handling

### Key Architectural Patterns
1. **Sense-Plan-Act (SPA) Loop**  
   The fundamental cycle of robotics:  
   ```python
   while robot_active:
       sensor_data = get_sensor_readings()  # Sense
       decision = planning_algorithm(sensor_data)  # Plan
       execute_movement(decision)  # Act
   ```

2. **Publisher-Subscriber Model**  
   Used in ROS for decentralized communication:
   ```
   [Sensor Node] --publishes--> [Topic] <--subscribes-- [Control Node]
   ```
   ![ROS Network Architecture](https://www.researchgate.net/publication/317111448/figure/fig1/AS:11431281210024766@1701932257884/The-ROS-network-ROS-robot-operating-system.tif)

3. **State Machines**  
   Manage complex robot behaviors:
   ```python
   states = ["SEARCH", "GRASP", "MOVE", "RELEASE"]
   current_state = states[0]
   ```

### Real-World Example: Autonomous Vacuum
- **Sensors**: Lidar, bumpers, cliff detectors  
- **Plan**: Pathfinding algorithm (A*)  
- **Act**: Wheel motor controllers  

![Global Network Communication](https://img.freepik.com/premium-photo/visual-representation-global-network-nodes-interconnected-worldwide-internet-communication-technology-depicted-image-earth-with-network-lines-concept-global-network_864588-61929.jpg)

---

## Topic 7.2: Robotic Perception Implementation

### Processing Sensor Data
Robots perceive the world through sensors. Let's process simulated LiDAR data:

```python
import numpy as np

# Simulated 360-degree LiDAR scan (8 directions)
lidar_data = [3.2, 1.8, 999, 2.1, 2.0, 999, 2.5, 4.0]  # 999 = no detection

def detect_obstacles(scan, threshold=2.5):
    obstacles = []
    for angle, distance in enumerate(scan):
        if distance < threshold and distance > 0:
            obstacles.append(angle * 45)  # Convert to degrees
    return obstacles

print(f"Obstacles detected at angles: {detect_obstacles(lidar_data)}")
# Output: Obstacles detected at angles: [45, 135, 180]
```

### Computer Vision Basics
Simple color detection with OpenCV:
```python
import cv2

frame = cv2.imread("robot_view.jpg")  # Replace with camera feed
hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)

# Define red color range (for stop signs)
lower_red = np.array([0, 100, 100])
upper_red = np.array([10, 255, 255])
mask = cv2.inRange(hsv, lower_red, upper_red)

contours, _ = cv2.findContours(mask, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
if contours:
    print("RED OBJECT DETECTED!")  # Trigger safety stop
```

### 📺 Related Video: [What is ROS, When to use it, and Why ?](https://www.youtube.com/watch?v=8QfI5a7lTKU)
*Description: Comprehensive tutorial explaining ROS fundamentals and its application in robotic systems*

---

## Topic 7.3: Control Systems & Error Handling

### PID Controller Implementation
Proportional-Integral-Derivative controllers maintain stability. Cruise control example:

```python
class PIDController:
    def __init__(self, kp, ki, kd):
        self.kp = kp  # Proportional gain
        self.ki = ki  # Integral gain
        self.kd = kd  # Derivative gain
        self.prev_error = 0
        self.integral = 0
        
    def compute(self, setpoint, current_value):
        error = setpoint - current_value
        self.integral += error
        derivative = error - self.prev_error
        output = self.kp*error + self.ki*self.integral + self.kd*derivative
        self.prev_error = error
        return output

# Maintain 5 m/s speed
pid = PIDController(0.8, 0.01, 0.05)
current_speed = 3.0
for _ in range(10):
    correction = pid.compute(5.0, current_speed)
    current_speed += correction * 0.1  # Simulate acceleration
    print(f"Adjusted speed: {current_speed:.2f} m/s")
```

### Robotic Error Handling Best Practices
1. **Watchdog Timers**: Auto-shutdown if node freezes
2. **Graceful Degradation**: Reduce functionality instead of crashing
3. **ROS-Specific Strategies**:
```bash
# Monitor node heartbeat
ros2 lifecycle manage /navigation_node
```

### 📺 Related Video: [Driving the adoption of a common Robotics Middleware Framework](https://www.youtube.com/watch?v=0ag88KMeOtg)
*Description: Demonstration of middleware frameworks for robust robotic communication and error handling*

### Debugging Exercise
What's wrong with this sensor callback?
```python
def sensor_callback(data):
    global battery_level
    battery_level = data.voltage / 12.0  # 12V system
    if battery_level < 0.2:
        print("Low battery!")
    process_data(data)  # CPU-intensive function
```
**Solution**: Move `process_data()` to a separate thread to avoid blocking critical battery checks.

---

## Key Takeaways
- Robotic architecture follows predictable patterns like SPA and pub/sub
- Sensor processing transforms raw data into actionable information
- Control algorithms like PID enable precise physical interactions
- 80% of robotics debugging involves timing and edge cases
- Always prioritize safety in error handling

## Practice Exercises
1. **Architecture Design**: Sketch the SPA loop for a delivery robot picking up packages  
2. **Sensor Challenge**: Modify the LiDAR code to ignore temporary shadows (hint: use moving average)  
3. **PID Tuning**: Adjust `kp`, `ki`, `kd` values to reduce oscillation in the speed controller  
4. **Debugging**: Identify 3 risks in this code:
```python
def move_to(target):
    while distance_to(target) > 0.1:
        set_velocity(MAX_SPEED)  # Always max speed
```

## Visual Resources
### 🖼️ Images
1. ![ROS Network Architecture](https://www.researchgate.net/publication/317111448/figure/fig1/AS:11431281210024766@1701932257884/The-ROS-network-ROS-robot-operating-system.tif)  
   *ROS communication architecture diagram*

2. ![Global Network Nodes](https://img.freepik.com/premium-photo/visual-representation-global-network-nodes-interconnected-worldwide-internet-communication-technology-depicted-image-earth-with-network-lines-concept-global-network_864588-61929.jpg)  
   *Robotic system network communication concept*

3. ![System Hierarchy](https://hooshmand.net/wp-content/uploads/2024/07/futuristic-diverse-organization-hierarchy-illustration-jpg-768x439.jpg)  
   *Modern robotic system architecture*

### 🎥 Videos
1. [What is ROS, When to use it, and Why ?](https://www.youtube.com/watch?v=8QfI5a7lTKU)  
   *ROS fundamentals tutorial with practical examples*

2. [Robotics Middleware Framework](https://www.youtube.com/watch?v=0ag88KMeOtg)  
   *Middleware implementation for robust robotic systems*

3. [Creating a Virtual Private Cloud](https://www.youtube.com/watch?v=cAsqssPrVTs)  
   *Networking concepts applicable to robotic systems*

## References & Further Reading
| Resource | Description |
|----------|-------------|
| [ROS for Beginners](https://roboticsbackend.com/ros-projects/) | Hands-on project tutorials |
| _Robotic Systems Engineering_ by McCauley | Architectural patterns |
| PID Tuner App (Android/iOS) | Interactive controller tuning |
| ROS 2 Foxy Documentation | Official error handling guidelines |
```
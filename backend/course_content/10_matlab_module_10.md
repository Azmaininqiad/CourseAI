```markdown
# MATLAB Module 10: Data Visualization and Automation  
**Difficulty**: Beginner  
**Estimated Reading Time**: 12 minutes  

---

## Introduction  
Welcome to Module 10! In this module, you’ll learn how to visualize data using MATLAB’s powerful plotting tools and automate tasks using scripts. By the end, you’ll create professional plots, customize their appearance, and write reusable code. Let’s dive in!  

![MATLAB Surface Plot Example](https://www.mathworks.com/help/matlab/visualize/surface_ex2.png)  
*Example of advanced data visualization in MATLAB - Surface plot of a mathematical function*

---

## Topic 10.1: Basic 2D Plotting  
### Why Plotting Matters  
Visualizing data helps identify patterns, trends, and outliers. MATLAB’s `plot()` function is your primary tool for creating 2D graphs.  

### Step-by-Step Guide  
1. **Create Data**:  
   ```matlab
   x = 0:0.1:10;       % X-values from 0 to 10 in 0.1 increments
   y = sin(x);         % Y-values (sine wave)
   ```

2. **Generate a Basic Plot**:  
   ```matlab
   plot(x, y);         % Creates a line plot
   title('Sine Wave'); % Add title
   xlabel('X-Axis');   % Label X-axis
   ylabel('Y-Axis');   % Label Y-axis
   grid on;            % Enable gridlines
   ```
   
3. **Customize Appearance**:  
   ```matlab
   plot(x, y, 'r--', 'LineWidth', 2); % Red dashed line, thickness=2
   legend('y = sin(x)');              % Add legend
   ```

### Key Concepts  
- Use `plot(x, y)` for line graphs.  
- Customize with color (`r` for red, `b` for blue), style (`-` solid, `--` dashed), and markers (`o` for circles).  
- Always label axes and add titles for clarity.  

---

## Topic 10.2: Multi-Plot Visualizations  
### Managing Multiple Datasets  
Compare data by overlaying plots or using subplots.  

### Tutorial: Overlay Plots  
```matlab
y2 = cos(x);                 % Second dataset
plot(x, y, 'b-', x, y2, 'r:'); 
legend('Sine', 'Cosine');
```

### Tutorial: Subplots  
Divide a figure into a grid:  
```matlab
subplot(2, 1, 1);  % 2 rows, 1 column, position 1
plot(x, y); 
title('Sine Wave');

subplot(2, 1, 2);  % Position 2
plot(x, y2);
title('Cosine Wave');
```

### Formatting Tips  
- Adjust figure size: `figure('Position', [100, 100, 800, 400])`  
- Save plots: `saveas(gcf, 'myplot.png')`  

---

## Topic 10.3: Scripts and Automation  
### Why Automate?  
Scripts (`.m` files) execute sequences of commands, saving time on repetitive tasks.  

### Step-by-Step: Create a Script  
1. Open the **Editor** tab > Click *New Script*.  
2. Paste code:  
   ```matlab
   % Plot temperature conversion (Fahrenheit to Celsius)
   fahrenheit = -40:10:100;
   celsius = (fahrenheit - 32) * 5/9;
   plot(fahrenheit, celsius, 'ko-');
   xlabel('Fahrenheit');
   ylabel('Celsius');
   ```
3. Save as `temp_conversion.m` > Click *Run*.  

### Functions: Reusable Code  
Create functions for calculations:  
```matlab
function area = circle_area(radius)
    % Calculate circle area
    area = pi * radius^2; 
end
```
Call it from the Command Window:  
```matlab
circle_area(5)  % Returns 78.5398
```

---

## Key Takeaways  
1. Use `plot()` to visualize data with labels, titles, and legends.  
2. Employ `subplot()` for side-by-side comparisons.  
3. Scripts (`.m` files) automate multi-step tasks.  
4. Functions encapsulate reusable logic.  

---

## Practice Exercises  
1. Plot `y = x^2` for `x = 1:5` with blue squares and a dashed line.  
2. Create a 2x2 subplot grid showing sine, cosine, tangent, and logarithmic curves.  
3. Write a function `rectangle_area(length, width)` and compute the area for `(4, 7)`.  

---

## References & Further Reading  
1. [MATLAB Plotting Documentation](https://mathworks.com/help/matlab/plotting.html)  
2. [Creating Functions in MATLAB](https://mathworks.com/help/matlab/function-basics.html)  
3. **Book**: *MATLAB for Beginners: A Practical Approach* (Chapter 7)  

---

## Visual Resources  
### 🔍 Related Image  
![MATLAB Surface Visualization](https://www.mathworks.com/help/matlab/visualize/surface_ex2.png)  
*Surface plot demonstrating MATLAB's 3D visualization capabilities* - Shows how to represent complex mathematical functions as surfaces
```
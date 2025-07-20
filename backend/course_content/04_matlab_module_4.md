```markdown
# MATLAB Module 4: Core Programming Concepts

## Introduction
Welcome to Module 4! In this module, we'll explore MATLAB's fundamental building blocks that form the basis of scientific computing and data analysis. By the end, you'll be able to manipulate data efficiently using matrices, automate tasks through scripts, create reusable functions, and visualize results. This module focuses on practical implementation - we'll use real-world examples like temperature analysis and financial forecasting to demonstrate concepts. Remember to experiment with all code examples in your MATLAB environment!

[VIDEO: Introduction to Matrix Operations]

## Topic 4.1: Working with Matrices and Arrays
Matrices are the heart of MATLAB (short for MATrix LABoratory). Understanding matrix operations unlocks MATLAB's computational power.

### Key Concepts
- **Matrix Creation**: Create matrices using square brackets `[]`
```matlab
A = [1 2 3; 4 5 6; 7 8 9]  % 3x3 matrix
row_vector = 1:0.5:3        % Creates [1, 1.5, 2, 2.5, 3]
```
- **Indexing Methods**:
  - Linear indexing: `A(3)`
  - Row/column: `A(2,3)`
  - Colon operator: `A(1:2, :)`

### Step-by-Step: Matrix Operations
Let's analyze daily temperatures:
```matlab
% Step 1: Create temperature matrix (days x cities)
temps = [22, 25, 19; 24, 26, 18; 23, 27, 20]; 

% Step 2: Access Chicago data (column 2)
chicago_temps = temps(:,2)  % Returns [25; 26; 27]

% Step 3: Calculate daily averages
daily_avg = mean(temps, 2)  % Second dimension = rows
```

### Special Matrices
```matlab
zeros(3,2)  % 3x2 matrix of zeros
ones(1,4)   % Row vector of ones
eye(3)      % 3x3 identity matrix
rand(2,2)   % Random uniform distribution
```

[IMAGE: Matrix indexing visualization]

## Topic 4.2: Scripts and Functions
Automate repetitive tasks and create reusable code components.

### Creating and Running Scripts
1. Click "New Script" in HOME tab
2. Save as `analyze_data.m`
3. Contains:
```matlab
% Load temperature data
data = load('temperatures.csv');

% Calculate statistics
max_temp = max(data);
min_temp = min(data);
fprintf('Max: %.2f°C, Min: %.2f°C\n', max_temp, min_temp)
```

### Building Functions
Function syntax:
```matlab
function output = function_name(inputs)
% COMMENT: Description
code
end
```

#### Practical Example: Compound Interest
Create `compound_interest.m`:
```matlab
function balance = compound_interest(principal, rate, years)
% Calculate compound interest
balance = principal * (1 + rate)^years;
end
```
Call from command window:
```matlab
savings = compound_interest(1000, 0.05, 10)  % ≈1628.89
```

### Debugging Tips
- Use `dbstop if error` to pause on errors
- Check workspace variables
- Step through code with F10

[VIDEO: Function creation demo]

## Topic 4.3: Basic Data Visualization
Transform data into insights with plots.

### Core Plotting Functions
- `plot(x,y)`: Line plot
- `bar(y)`: Vertical bar chart
- `scatter(x,y)`: Correlation plots
- `histogram(x)`: Distribution visualization

### Step-by-Step: Financial Forecast
Visualize investment growth:
```matlab
% Generate data
years = 0:10;
growth = 1000 * (1.08).^years;

% Create figure
figure  % New window
plot(years, growth, 'b-s', 'LineWidth', 2)
title('Investment Growth at 8% APR')
xlabel('Years')
ylabel('Balance ($)')
grid on

% Add annotation
text(5, 1500, 'Doubling point', 'FontSize',12)
```

### Customizing Plots
```matlab
% Multiple lines on same plot
hold on
plot(years, 1000*(1.06).^years, 'r--')
legend('8% Growth', '6% Growth')

% Save figure
print('growth_plot.png', '-dpng')
```

[IMAGE: Side-by-side plot comparison]

## Key Takeaways
1. **Matrix Operations**: Mastered indexing and manipulation of n-dimensional data
2. **Automation**: Created reusable scripts and functions with input/output
3. **Visualization**: Generated professional plots with labels and legends
4. **Debugging**: Learned basic troubleshooting techniques
5. **Real-world Applications**: Applied concepts to temperature analysis and financial modeling

## Practice Exercises
1. Create a 4x4 magic matrix using `magic(4)` and extract its diagonal elements
2. Write a function `convert_temp` that changes Celsius to Fahrenheit
3. Plot sine and cosine waves from -π to π with different line styles
```matlab
% Starter code for exercise 3:
x = linspace(-pi, pi, 100);
y1 = sin(x);
y2 = cos(x);
% Add plotting commands here
```
4. Debug this script (find 3 errors):
```matlab
function output = calculate_area(radius)
% Calculate circle area
output = π * radius.2;  % Line 3
end  % Line 4
```

## References and Further Reading
1. MATLAB Onramp (Free tutorial at MathWorks)
2. *MATLAB for Beginners* by Michael Fitzpatrick
3. Official Documentation: MathWorks Help Center
4. Community Resources: MATLAB Central File Exchange
```
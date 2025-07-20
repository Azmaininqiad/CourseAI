```markdown
# MATLAB Module 2: Core Programming Concepts

## Introduction  
Welcome to Module 2! In this module, you'll build foundational MATLAB programming skills. We’ll explore vectors/matrices, data visualization, and program flow control—essential tools for scientific computing. By the end, you’ll create dynamic plots, manipulate multi-dimensional data, and automate decisions in scripts.  

```python
% Sample introductory code
disp('Starting Module 2: Core MATLAB Concepts');
```

---

## Topic 2.1: Vectors and Matrices

### **Creating Arrays**  
MATLAB excels at numerical operations. Let's create arrays:  
- **Row vector**: `v = [1, 2, 3]`  
- **Column vector**: `v = [1; 2; 3]`  
- **Matrix**: `A = [1, 2; 3, 4]`  

Use built-in functions for special matrices:  
```matlab
zeros(3)    % 3x3 matrix of zeros
ones(2,4)   % 2x4 matrix of ones
rand(5)     % 5x5 random matrix (0-1)
```

### **Indexing and Slicing**  
Access elements using `(row, column)` indices:  
```matlab
B = [10 20 30; 40 50 60]; 
B(2,3)      % Returns 60
B(:,1)      % Returns [10; 40] (first column)
B(1,1:2)    % Returns [10, 20]
```

![Matrix Visualization: Schemaball](https://i.sstatic.net/6UXjq.png)  
*Visualizing matrix relationships with schemaball plots*

### **Matrix Operations**  
Perform arithmetic:  
```matlab
A = [1 2; 3 4];
C = A * 2    % Scalar multiplication: [2 4; 6 8]
D = A + C    % Element-wise addition
E = A * D    % Matrix multiplication
```

### 📺 Related Video: [Linear Algebra - Matrix Operations](https://www.youtube.com/watch?v=p48uw2vFWQs)  
*Description: Quick review of matrix arithmetic, scalar multiplication, and matrix multiplication. (Postcard Professor)*

---

## Topic 2.2: Data Visualization

### **2D Plotting**  
Plot with `plot(x,y)`:  
```matlab
x = 0:0.1:2*pi; 
y = sin(x);
plot(x, y, 'r--o'); 
xlabel('Angle (rad)'); 
ylabel('sin(x)');
title('Sine Wave');
grid on;
```

### **Customizing Plots**  
Enhance visuals:  
```matlab
hold on;              % Overlay plots
y2 = cos(x);
plot(x, y2, 'b:*');  
legend('sin', 'cos'); 
hold off;
```

### **Subplots**  
Divide figures into panes:  
```matlab
subplot(2,1,1);   % 2 rows, 1 column, position 1
plot(x,y);
subplot(2,1,2);   % Position 2
bar(x,y2);
```

---

## Topic 2.3: Program Control Flow

### **Conditional Statements**  
Make decisions with `if-else`:  
```matlab
a = randi(100);
if a > 50
    disp('High value!');
elseif a < 10
    disp('Low value!');
else
    disp('Medium value');
end
```

### **Loops**  
Automate repetitive tasks:  
```matlab
% For loop: Sum integers 1 to 10
total = 0;
for k = 1:10
    total = total + k;
end

% While loop: Countdown
n = 5;
while n > 0
    disp(n);
    n = n - 1;
end
```

### **Scripts vs. Functions**  
- **Scripts**: Sequence of commands (saved as `.m` files)  
- **Functions**: Reusable code with inputs/outputs:  
```matlab
function area = circleArea(radius)
    area = pi * radius^2;
end
```
Call in command window: `circleArea(5)`

---

## Key Takeaways  
1. **Arrays**: Use `[ ]` for vectors/matrices; leverage indexing.  
2. **Visualization**: Customize plots with labels, colors, and subplots.  
3. **Control Flow**: Automate logic with `if`/`for`/`while`.  
4. **Reusability**: Encapsulate code in functions.  

---

## Practice Exercises  
1. Create a 4×4 identity matrix and extract its diagonal elements.  
2. Plot exponential decay: `y = e^(-x)` for 0≤x≤5. Add grid lines.  
3. Write a function `isEven(n)` that returns `true` if `n` is even.  
4. Use a `while` loop to print Fibonacci numbers ≤100.  

---

## Visual Resources
### Images  
- [Matrix Schemaball Visualization](https://i.sstatic.net/6UXjq.png) - Diagram showing matrix element relationships  

### Videos  
- [Matrix Operations Tutorial](https://www.youtube.com/watch?v=p48uw2vFWQs) - Covers core matrix arithmetic (7 mins)

---

## References & Further Reading  
- [MATLAB Onramp Course (MathWorks)](https://matlabacademy.mathworks.com)  
- *MATLAB for Beginners* (Chapman Textbook, Ch. 3-5)  
- [Plotting Documentation](https://www.mathworks.com/help/matlab/2-and-3d-plots.html)  
```
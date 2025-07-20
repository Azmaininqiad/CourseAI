```markdown
# MATLAB Module 3: Basic Data Analysis and Visualization  
**Difficulty**: Beginner  
**Approximate Reading Time**: 12 minutes  

---

## Introduction  
Welcome to Module 3! Here, you’ll transform raw data into meaningful insights using MATLAB’s analysis and visualization tools. By the end, you’ll confidently perform statistical operations, create professional 2D plots, and manage multiple visualizations. Let’s turn numbers into stories!  

---

## Topic 3.1: Fundamentals of Data Analysis  
### Statistical Operations  
MATLAB simplifies data analysis with built-in functions:  
- **Mean**: `mean(data)`  
- **Median**: `median(data)`  
- **Standard Deviation**: `std(data)`  

**Example**: Analyze exam scores stored in a vector:  
```matlab
scores = [88, 92, 76, 95, 83];
avg_score = mean(scores);
med_score = median(scores);
stdev = std(scores);
```  
**Output**:  
```
avg_score = 86.8  
med_score = 88  
stdev = 7.395  
```  
![Scores Distribution Analysis](https://www.mathworks.com/help/matlab/visualize/surface_ex2.png)  
*Figure: Statistical analysis visualization example*

### Handling Vectors and Matrices  
Apply functions across matrix dimensions:  
```matlab
temperature_data = [72, 75, 71; 68, 69, 64; 80, 77, 78];
column_means = mean(temperature_data, 1); % Means of each column
```  

---

## Topic 3.2: Creating 2D Plots  
### Basic Plot Types  
Visualize data with:  
- Line plots: `plot(x, y)`  
- Scatter plots: `scatter(x, y)`  
- Bar charts: `bar(x, y)`  

**Step-by-Step Tutorial**: Plot a sine wave.  
```matlab
x = linspace(0, 2*pi, 100); % 100 points from 0 to 2π
y = sin(x);
plot(x, y, 'b--', 'LineWidth', 2); % Blue dashed line
title('Sine Wave');
xlabel('Angle (radians)');
ylabel('sin(x)');
grid on;
```  
### Customization Tips  
Modify aesthetics using:  
```matlab
legend('sin(x)', 'Location', 'northeast'); % Add legend
ylim([-1.5, 1.5]); % Adjust y-axis limits
```

---

## Topic 3.3: Managing Multiple Plots and Exporting  
### Subplots  
Compare plots side-by-side with `subplot()`:  
```matlab
% Create 2x1 grid (rows x columns), activate first section
subplot(2, 1, 1); 
plot(x, sin(x), 'r');
title('Sine');

% Activate second section
subplot(2, 1, 2); 
plot(x, cos(x), 'g');
title('Cosine');
```  
### Exporting Figures  
Save visualizations for reports:  
```matlab
saveas(gcf, 'sine_cosine_comparison.png'); % Saves current figure
% Formats: .png, .jpg, .pdf
```  
### 📺 Related Video: [Master Advanced Plotting in MATLAB](https://www.youtube.com/watch?v=yPHVbxUrjJE)  
*Description: Unlock the full potential of your data visualization skills with our detailed MATLAB tutorial on advanced plotting techniques!*

---

## Key Takeaways  
1. Use `mean()`, `median()`, and `std()` for quick data insights.  
2. Customize plots with labels, colors, and grids.  
3. Compare data using subplots (`subplot(m,n,p)`).  
4. Export figures with `saveas()`.  

---

## Practice Exercises  
1. Compute the variance of `data = [4, 8, 6, 5, 3]`.  
2. Plot exponential decay: `y = exp(-x)` for `x = 0:0.1:5`. Add a title "Exponential Decay".  
3. Create a figure with two side-by-side subplots: left for `y = x^2`, right for `y = sqrt(x)` (`x = 0:0.1:10`).  

---

## References & Further Reading  
- [MATLAB Onramp](https://matlabacademy.mathworks.com/)  
- *MATLAB for Dummies* by Jim Sizemore (Ch. 5)  
- MathWorks Documentation: "Graphics and Data Visualization"  

---

## Visual Resources  
### Images:  
- [Statistical Analysis Visualization](https://www.mathworks.com/help/matlab/visualize/surface_ex2.png)  
### Videos:  
- [Master Advanced Plotting in MATLAB](https://www.youtube.com/watch?v=yPHVbxUrjJE) - Advanced plotting techniques tutorial (6m49s)
```
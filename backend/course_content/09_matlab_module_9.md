```markdown
# Module 9: Data Visualization in MATLAB  
**Difficulty Level**: Beginner  
**Estimated Reading Time**: 10-12 minutes  

![MATLAB Visualization Banner](https://www.mathworks.com/discovery/data-visualization/_jcr_content/mainParsys/band_1231704498_copy/mainParsys/lockedsubnav/mainParsys/columns_99757339/ebe28e08-4871-42a8-a122-147bc6c06386/columns_1697083820_c_1312823950/2bf7bdf4-b7d0-4bcd-bfe8-95fe4ff20ac6/image.adapt.full.medium.jpg/1751307446026.jpg)  

## Introduction  
Data visualization transforms raw data into intuitive graphical representations, enabling clearer insights and pattern discovery. In this module, you'll master core MATLAB techniques to create, customize, and interpret plots for effective data communication. By the end, you'll visualize complex datasets using 2D/3D plots and interactive tools.  

---

## Topic 9.1: Fundamentals of 2D Plotting  
### Key Concepts  
- **`plot()`**: Primary function for creating 2D line graphs.  
- **Vectors as Inputs**: X-axis (independent variable) and Y-axis (dependent variable) data.  
- **Styling Syntax**: Control color (`'r'`), line style (`'--'`), and markers (`'o'`) using string arguments.  

### Step-by-Step Tutorial  
1. **Basic Line Plot**:  
   ```matlab
   x = 0:0.1:2*pi;  
   y = sin(x);  
   plot(x, y, 'b-'); % Blue solid line  
   title('Sine Wave');  
   xlabel('Angle (radians)');  
   ylabel('Amplitude');  
   grid on;  
   ```  
   *Output: Smooth sine curve from 0 to 2π.*  

2. **Customizing Appearance**:  
   ```matlab
   plot(x, cos(x), 'ro--', 'LineWidth', 2, 'MarkerSize', 8);  
   legend('Cosine');  
   ```  
   *Output: Red dashed line with circular markers.*  

---

## Topic 9.2: Advanced Plot Customization  
### Key Concepts  
- **Subplots**: Divide figures into grids using `subplot(m,n,p)`.  
- **Axis Controls**: Adjust limits with `xlim([min max])`, `ylim()`.  
- **Annotations**: Add text with `text(x,y,'Label')` or `annotation()`.  

### Practical Example: Weather Data Comparison  
```matlab
% Data  
days = 1:7;  
london_temp = [18, 17, 19, 20, 22, 21, 19];  
tokyo_temp = [22, 23, 25, 27, 28, 26, 24];  

% Create subplots  
subplot(2,1,1);  
plot(days, london_temp, 'ks-');  
title('London Daily Temperature');  

subplot(2,1,2);  
bar(days, tokyo_temp, 'FaceColor', [0.9, 0.5, 0.2]); % Orange bars  
title('Tokyo Daily Temperature');  

% Adjust axis  
xlim([1 7]);  
set(gca, 'XTick', 1:7); % Force integer ticks  
```  
*Output: Two stacked plots comparing temperatures with different styles.*  

---

## Topic 9.3: 3D Visualization Techniques  
### Key Concepts  
- **`meshgrid()`**: Creates coordinate matrices for 3D functions.  
- **Surface Plots**: Use `surf(X,Y,Z)` for colored surfaces.  
- **Contour Plots**: Display elevation with `contourf()`.  

### Guided Exercise: Visualize a Mathematical Function  
1. Generate data:  
   ```matlab
   [X,Y] = meshgrid(-2:0.1:2);  
   Z = X .* exp(-X.^2 - Y.^2); % Gaussian function  
   ```  

2. Create 3D surface:  
   ```matlab
   figure;  
   surf(X,Y,Z);  
   colormap('jet'); % Color palette  
   colorbar; % Adds scale  
   shading interp; % Smooth color transition  
   ```  

3. Add contour plot:  
   ```matlab
   figure;  
   contourf(X,Y,Z, 20); % 20 contour levels  
   axis equal;  
   ```  

---

## Summary of Key Takeaways  
- 🎯 **2D Plots**: Use `plot()` with styling options for line graphs.  
- 🛠️ **Customization**: Employ `subplot`, axis controls, and annotations for clarity.  
- 📊 **3D Visualization**: Render surfaces with `surf()` and `contourf()`.  
- 💡 Always label axes, add titles, and include legends for professional visuals.  

---

## Practice Exercises  
1. Plot `y = e^x` for `x = -5:0.5:5` using green diamonds connected by dotted lines.  
2. Create a 2x2 subplot grid displaying four trigonometric functions (`sin`, `cos`, `tan`, `cot`).  
3. Generate and visualize a 3D paraboloid: `Z = X.^2 + Y.^2` for `X,Y` in [-10,10].  

---

## References & Further Reading  
- [MATLAB Plotting Documentation](https://mathworks.com/help/matlab/plots.html)  
- **Recommended Book**: *MATLAB for Beginners* by R. Padmanabhan (Ch. 7)  
- **Video Resource**: [MATLAB Tools for Scientists: Introduction to Statistical Analysis](https://www.youtube.com/watch?v=4ipdsefA5ik)  
  *Description: Researchers and scientists have to commonly process, visualize and analyze large amounts of data to extract patterns, identify trends, and test hypotheses. Duration: 54:53.*  

---

## Visual Resources  
- **Banner Image**: [Data Visualization with MATLAB](https://www.mathworks.com/discovery/data-visualization/_jcr_content/mainParsys/band_1231704498_copy/mainParsys/lockedsubnav/mainParsys/columns_99757339/ebe28e08-4871-42a8-a122-147bc6c06386/columns_1697083820_c_1312823950/2bf7bdf4-b7d0-4bcd-bfe8-95fe4ff20ac6/image.adapt.full.medium.jpg/1751307446026.jpg)  
- **Featured Video**: [MATLAB Tools for Scientists: Introduction to Statistical Analysis](https://www.youtube.com/watch?v=4ipdsefA5ik)  
```
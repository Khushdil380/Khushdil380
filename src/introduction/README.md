# 🎬 Introduction Section - Typewriter Animation

This section generates a typewriter animation SVG for your GitHub profile introduction.

## 📂 Generated Files
- `assets/introduction/typewriter.svg` - Your typewriter animation

## 🎨 Customization

Edit the variables at the top of `typewriter-generator.js`:

### ✏️ Text Content
```javascript
lines: [
  "Hello, I'm Khushdil Ansari",
  "Full Stack Developer", 
  "Problem Solver + Tech Enthusiast",
  "Always Learning, Always Growing"
]
```

### ⏱️ Animation Speed
```javascript
typingSpeed: 0.1,    // Speed of typing (seconds per character)
lineDelay: 2,        // Pause at end of each line (seconds)
eraseSpeed: 0.05,    // Speed of erasing (seconds per character)
```

### 🎨 Colors
```javascript
textColor: "#62F73A",    // Main text color
cursorColor: "#62F73A",  // Cursor color  
glowColor: "#62F73A",    // Glow effect color
```

### 📝 Text Style
```javascript
fontSize: 28,        // Font size in pixels
fontFamily: "Fira Code, Consolas, Monaco, monospace"
```

### 📐 SVG Size
```javascript
width: 600,          // SVG width
height: 80,          // SVG height
```

### 💫 Effects
```javascript
enableGlow: true,    // Enable/disable glow effect
showCursor: true     // Show/hide blinking cursor
```

## 🚀 Usage

1. **Generate SVG:**
   ```bash
   node src/introduction/typewriter-generator.js
   ```

2. **Use in README:**
   ```markdown
   <p align="center">
     <img src="https://raw.githubusercontent.com/Khushdil380/Khushdil380/main/assets/introduction/typewriter.svg" alt="Typewriter Animation" />
   </p>
   ```

## 🎯 Quick Examples

### Fast Typing
```javascript
typingSpeed: 0.05
eraseSpeed: 0.03
```

### No Erasing (Display Only)
```javascript
eraseSpeed: 0
lineDelay: 0
```

### Different Colors
```javascript
// Matrix Green
textColor: "#00FF00"

// Retro Amber  
textColor: "#FFB000"

// Cool Blue
textColor: "#00BFFF"
```

## 🔧 Notes

- Special characters (&, <, >, ", ') are automatically escaped for XML compatibility
- The SVG is self-contained and works in GitHub README files
- Animation loops automatically
- All timing is in seconds
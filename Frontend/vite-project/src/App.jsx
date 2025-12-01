import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// Import services
import contentService from './services/contentService';
import imageService from './services/imageService';
import bannerService from './services/bannerService';
import projectService from './services/projectService';

// API base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function App() {
  // State management
  const [activeTab, setActiveTab] = useState('enhance');
  const [uploadedImages, setUploadedImages] = useState([]);
  const [currentImage, setCurrentImage] = useState(null);
  const [selectedTone, setSelectedTone] = useState('professional');
  const [currentProjectId, setCurrentProjectId] = useState(null); // ✅ NEW: Track current project
  const [stats, setStats] = useState({
    images: 0,
    content: 0,
    banners: 0,
    projects: 0
  });

  // Enhancement controls
  const [enhancements, setEnhancements] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    sharpness: 0
  });

  // Content generation state
  const [contentForm, setContentForm] = useState({
    productName: '',
    category: '',
    features: '',
    audience: '',
    contentType: 'description',
    sizeTableType: 'clothing',
    unitType: 'inches'
  });
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Banner state
  const [bannerForm, setBannerForm] = useState({
    templateType: 'sale',
    mainText: 'SUMMER SALE',
    subtext: 'Up to 50% OFF',
    ctaText: 'Shop Now',
    bgColor: '#667eea',
    textColor: '#ffffff',
    accentColor: '#ffd700'
  });
  const [bannerPreview, setBannerPreview] = useState(null);

  // Catalogue state
  const [catalogueForm, setCatalogueForm] = useState({
    title: 'Spring Collection 2024',
    brand: 'FASHION CO.',
    catalogueColor: '#2c3e50',
    style: 'modern'
  });

  // Toast notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ✅ Load project on mount (if exists)
  useEffect(() => {
    const loadSavedProject = async () => {
      const savedProjectId = localStorage.getItem('currentProjectId');
      if (savedProjectId) {
        try {
          const response = await projectService.getProject(savedProjectId);
          setCurrentProjectId(savedProjectId);
          setStats({
            images: response.project.stats.imagesEnhanced || 0,
            content: response.project.stats.contentGenerated || 0,
            banners: response.project.stats.bannersCreated || 0,
            projects: 1
          });
        } catch (error) {
          console.log('No existing project found, will create new one');
          localStorage.removeItem('currentProjectId');
        }
      }
    };
    loadSavedProject();
  }, []);

  // ✅ Image upload handler with database integration
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const formData = new FormData();
    
    files.forEach(file => {
      formData.append('images', file);
    });

    // Add projectId if exists
    if (currentProjectId) {
      formData.append('projectId', currentProjectId);
    }

    try {
      const response = await imageService.uploadImages(formData);

      setUploadedImages([...uploadedImages, ...response.files]);
      
      // ✅ Save projectId from response
      if (response.projectId) {
        setCurrentProjectId(response.projectId);
        localStorage.setItem('currentProjectId', response.projectId);
      }

      setStats(prev => ({ ...prev, images: prev.images + response.files.length }));
      showToast(`${response.files.length} image(s) uploaded successfully!`, 'success');
    } catch (error) {
      showToast('Failed to upload images', 'error');
      console.error('Upload error:', error);
    }
  };

  // ✅ Apply image enhancements with database save
  const applyEnhancements = async () => {
    if (!currentImage) {
      showToast('Please select an image first', 'warning');
      return;
    }

    try {
      const response = await imageService.enhanceImage({
        filename: currentImage.filename,
        enhancements: {
          brightness: enhancements.brightness / 100,
          contrast: enhancements.contrast / 100,
          saturation: enhancements.saturation / 100,
          sharpness: enhancements.sharpness
        },
        projectId: currentProjectId
      });

      showToast('Image enhanced and saved to database!', 'success');
      
      // Update current image with enhanced version
      setCurrentImage({
        ...currentImage,
        enhancedPath: response.enhancedPath
      });

      setStats(prev => ({ ...prev, images: prev.images + 1 }));
    } catch (error) {
      showToast('Failed to enhance image', 'error');
      console.error('Enhancement error:', error);
    }
  };

  // ✅ Generate content with database integration
  const generateContent = async () => {
    if (!contentForm.productName && contentForm.contentType !== 'sizetable') {
      showToast('Please enter a product name', 'warning');
      return;
    }

    setIsGenerating(true);
    setGeneratedContent('<div class="spinner"></div>');

    try {
      const response = await contentService.generate({
        ...contentForm,
        tone: selectedTone,
        projectId: currentProjectId
      });

      setGeneratedContent(response.content);
      
      // ✅ Save projectId from response
      if (response.projectId) {
        setCurrentProjectId(response.projectId);
        localStorage.setItem('currentProjectId', response.projectId);
      }

      setStats(prev => ({ ...prev, content: prev.content + 1 }));
      
      const sourceText = response.source === 'huggingface' ? 'AI (Hugging Face)' : 'Template';
      showToast(`Content generated using ${sourceText} and saved to database!`, 'success');
      
      console.log('✅ Content saved with Project ID:', response.projectId);
      console.log('📊 Stats:', response.stats);
      
    } catch (error) {
      showToast('Failed to generate content', 'error');
      console.error('Content generation error:', error);
      setGeneratedContent('<p style="color: red;">Error generating content. Please try again.</p>');
    } finally {
      setIsGenerating(false);
    }
  };

  // ✅ Generate banner with database integration
  const generateBanner = async () => {
    try {
      const response = await bannerService.generateBanner({
        templateType: bannerForm.templateType,
        mainText: bannerForm.mainText,
        subtext: bannerForm.subtext,
        ctaText: bannerForm.ctaText,
        colors: {
          background: bannerForm.bgColor,
          text: bannerForm.textColor,
          accent: bannerForm.accentColor
        },
        projectId: currentProjectId
      });

      setBannerPreview(response.path);
      
      // ✅ Save projectId from response
      if (response.projectId) {
        setCurrentProjectId(response.projectId);
        localStorage.setItem('currentProjectId', response.projectId);
      }

      setStats(prev => ({ ...prev, banners: prev.banners + 1 }));
      showToast('Banner generated and saved to database!', 'success');
    } catch (error) {
      showToast('Failed to generate banner', 'error');
      console.error('Banner generation error:', error);
    }
  };

  // ✅ Copy content to clipboard
  const copyContent = () => {
    const contentElement = document.getElementById('generated-content-display');
    if (contentElement) {
      const textContent = contentElement.innerText || contentElement.textContent;
      navigator.clipboard.writeText(textContent)
        .then(() => showToast('Content copied to clipboard!', 'success'))
        .catch(() => showToast('Failed to copy content', 'error'));
    }
  };

  // ✅ Regenerate content
  const regenerateContent = () => {
    generateContent();
  };

  // ✅ Download content as HTML
  const downloadContent = () => {
    const content = generatedContent;
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `content-${Date.now()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Content downloaded!', 'success');
  };

  // ✅ View project history
  const viewProjectHistory = async () => {
    if (!currentProjectId) {
      showToast('No project to view yet. Generate some content first!', 'warning');
      return;
    }

    try {
      const response = await projectService.getProject(currentProjectId);
      console.log('📁 Project Data:', response.project);
      
      const project = response.project;
      const summary = `
Project: ${project.name}
Type: ${project.type}
Created: ${new Date(project.createdAt).toLocaleString()}

Statistics:
- Images Enhanced: ${project.stats.imagesEnhanced}
- Content Generated: ${project.stats.contentGenerated}
- Banners Created: ${project.stats.bannersCreated}

Total Items:
- Images: ${project.images.length}
- Content: ${project.content.length}
- Banners: ${project.banners.length}
      `;
      
      alert(summary);
      showToast('Check console for full project details', 'success');
    } catch (error) {
      showToast('Failed to load project history', 'error');
      console.error('Project load error:', error);
    }
  };

  // ✅ Save project (manual save)
  const saveProject = async () => {
    if (!currentProjectId) {
      showToast('No project to save yet. Your work is auto-saved!', 'success');
      return;
    }

    showToast('Project is automatically saved to database!', 'success');
    console.log('Current Project ID:', currentProjectId);
  };

  // Reset enhancements
  const resetEnhancements = () => {
    setEnhancements({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      sharpness: 0
    });
    showToast('Reset to defaults', 'success');
  };

  // ✅ Start new project
  const startNewProject = () => {
    if (confirm('Start a new project? Current project ID will be cleared.')) {
      setCurrentProjectId(null);
      localStorage.removeItem('currentProjectId');
      setStats({ images: 0, content: 0, banners: 0, projects: 0 });
      showToast('New project started!', 'success');
    }
  };

  return (
    <div className="app">
      <div className="container">
        {/* Header */}
        <div className="header">
          <div className="header-content">
            <div className="logo">
              <div className="logo-icon">✨</div>
              <div className="logo-text">
                <h1>ContentCraft Pro</h1>
                <p>E-commerce Content Creation Suite</p>
              </div>
            </div>
            <div className="header-actions">
              <button className="btn btn-secondary" onClick={viewProjectHistory}>
                📊 View Project
              </button>
              <button className="btn btn-secondary" onClick={startNewProject}>
                🆕 New Project
              </button>
              <button className="btn btn-primary" onClick={saveProject}>
                💾 Auto-Saved {currentProjectId ? '✓' : ''}
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <h4>Images Enhanced</h4>
            <div className="stat-value">{stats.images}</div>
            <div className="stat-change">Project: {currentProjectId ? '✓' : '○'}</div>
          </div>
          <div className="stat-card">
            <h4>Content Generated</h4>
            <div className="stat-value">{stats.content}</div>
            <div className="stat-change">Database: {currentProjectId ? 'Saved' : 'Not saved'}</div>
          </div>
          <div className="stat-card">
            <h4>Banners Created</h4>
            <div className="stat-value">{stats.banners}</div>
            <div className="stat-change">+0 today</div>
          </div>
          <div className="stat-card">
            <h4>Active Projects</h4>
            <div className="stat-value">{currentProjectId ? 1 : 0}</div>
            <div className="stat-change">In progress</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'enhance' ? 'active' : ''}`}
            onClick={() => setActiveTab('enhance')}
          >
            🎨 Image Enhancement
          </button>
          <button 
            className={`tab ${activeTab === 'writing' ? 'active' : ''}`}
            onClick={() => setActiveTab('writing')}
          >
            ✍️ Content Writing
          </button>
          <button 
            className={`tab ${activeTab === 'banners' ? 'active' : ''}`}
            onClick={() => setActiveTab('banners')}
          >
            🎯 Marketing Banners
          </button>
          <button 
            className={`tab ${activeTab === 'catalogue' ? 'active' : ''}`}
            onClick={() => setActiveTab('catalogue')}
          >
            📚 Catalogue Designer
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-contents">
          {/* Image Enhancement Tab */}
          {activeTab === 'enhance' && (
            <div className="tab-content active">
              <div className="enhancement-grid">
                <div className="upload-section">
                  <h3>📤 Upload Images</h3>
                  <div className="upload-zone">
                    <input 
                      type="file" 
                      id="imageUpload" 
                      multiple 
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="imageUpload" className="upload-label">
                      <div className="upload-icon">📁</div>
                      <p>Click to upload or drag and drop</p>
                      <small>PNG, JPG, GIF up to 10MB</small>
                    </label>
                  </div>

                  {uploadedImages.length > 0 && (
                    <div className="uploaded-images">
                      <h4>Uploaded Images ({uploadedImages.length})</h4>
                      <div className="image-grid">
                        {uploadedImages.map((img, idx) => (
                          <div 
                            key={idx} 
                            className="image-thumb"
                            onClick={() => setCurrentImage(img)}
                          >
                            <img src={`${API_URL.replace('/api', '')}${img.path}`} alt={img.originalName} />
                            <p>{img.originalName}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {currentImage && (
                  <div className="enhancement-controls">
                    <h3>✨ Enhance Image</h3>
                    
                    <div className="control-group">
                      <label>Brightness: {enhancements.brightness}%</label>
                      <input 
                        type="range" 
                        min="0" 
                        max="200" 
                        value={enhancements.brightness}
                        onChange={(e) => setEnhancements({...enhancements, brightness: parseInt(e.target.value)})}
                      />
                    </div>

                    <div className="control-group">
                      <label>Contrast: {enhancements.contrast}%</label>
                      <input 
                        type="range" 
                        min="0" 
                        max="200" 
                        value={enhancements.contrast}
                        onChange={(e) => setEnhancements({...enhancements, contrast: parseInt(e.target.value)})}
                      />
                    </div>

                    <div className="control-group">
                      <label>Saturation: {enhancements.saturation}%</label>
                      <input 
                        type="range" 
                        min="0" 
                        max="200" 
                        value={enhancements.saturation}
                        onChange={(e) => setEnhancements({...enhancements, saturation: parseInt(e.target.value)})}
                      />
                    </div>

                    <div className="control-group">
                      <label>Sharpness: {enhancements.sharpness}</label>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={enhancements.sharpness}
                        onChange={(e) => setEnhancements({...enhancements, sharpness: parseInt(e.target.value)})}
                      />
                    </div>

                    <div className="button-group">
                      <button className="btn btn-primary" onClick={applyEnhancements}>
                        ✨ Apply Enhancements
                      </button>
                      <button className="btn btn-secondary" onClick={resetEnhancements}>
                        🔄 Reset
                      </button>
                    </div>

                    <div className="preview-section">
                      <h4>Preview</h4>
                      <img 
                        src={`${API_URL.replace('/api', '')}${currentImage.enhancedPath || currentImage.path}`} 
                        alt="Preview" 
                        style={{
                          filter: `brightness(${enhancements.brightness}%) contrast(${enhancements.contrast}%) saturate(${enhancements.saturation}%)`
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Content Writing Tab */}
          {activeTab === 'writing' && (
            <div className="tab-content active">
              <div className="writing-grid">
                <div className="input-section">
                  <h3>📝 Product Information</h3>
                  
                  <div className="form-group">
                    <label>Product Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g., Premium Cotton T-Shirt"
                      value={contentForm.productName}
                      onChange={(e) => setContentForm({...contentForm, productName: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label>Product Category</label>
                    <select 
                      value={contentForm.category}
                      onChange={(e) => setContentForm({...contentForm, category: e.target.value})}
                    >
                      <option value="">Select category...</option>
                      <option value="apparel">Apparel</option>
                      <option value="electronics">Electronics</option>
                      <option value="home">Home & Living</option>
                      <option value="beauty">Beauty & Care</option>
                      <option value="sports">Sports & Fitness</option>
                      <option value="accessories">Accessories</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Key Features (comma-separated)</label>
                    <textarea 
                      placeholder="e.g., 100% cotton, breathable, machine washable"
                      value={contentForm.features}
                      onChange={(e) => setContentForm({...contentForm, features: e.target.value})}
                      rows="3"
                    />
                  </div>

                  <div className="form-group">
                    <label>Target Audience</label>
                    <input 
                      type="text" 
                      placeholder="e.g., Young professionals, 25-35 years"
                      value={contentForm.audience}
                      onChange={(e) => setContentForm({...contentForm, audience: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label>Content Tone</label>
                    <div className="tone-selector">
                      {['professional', 'casual', 'luxury', 'playful', 'urgent'].map(tone => (
                        <button 
                          key={tone}
                          className={`tone-btn ${selectedTone === tone ? 'active' : ''}`}
                          onClick={() => setSelectedTone(tone)}
                        >
                          {tone.charAt(0).toUpperCase() + tone.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Content Type</label>
                    <select 
                      value={contentForm.contentType}
                      onChange={(e) => setContentForm({...contentForm, contentType: e.target.value})}
                    >
                      <option value="description">Product Description</option>
                      <option value="title">Product Title</option>
                      <option value="bullets">Bullet Points</option>
                      <option value="seo">SEO Description</option>
                      <option value="social">Social Media Post</option>
                      <option value="email">Email Marketing</option>
                      <option value="sizetable">Size Chart/Table</option>
                    </select>
                  </div>

                  {contentForm.contentType === 'sizetable' && (
                    <>
                      <div className="form-group">
                        <label>Size Chart Type</label>
                        <select 
                          value={contentForm.sizeTableType}
                          onChange={(e) => setContentForm({...contentForm, sizeTableType: e.target.value})}
                        >
                          <option value="clothing">Clothing (S, M, L, XL)</option>
                          <option value="shoes">Shoes (US/EU/UK)</option>
                          <option value="kids">Kids Clothing</option>
                          <option value="rings">Rings</option>
                          <option value="international">International Sizing</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Unit Type</label>
                        <select 
                          value={contentForm.unitType}
                          onChange={(e) => setContentForm({...contentForm, unitType: e.target.value})}
                        >
                          <option value="inches">Inches</option>
                          <option value="cm">Centimeters</option>
                          <option value="both">Both (in/cm)</option>
                        </select>
                      </div>
                    </>
                  )}

                  <button 
                    className="btn btn-primary" 
                    onClick={generateContent}
                    disabled={isGenerating}
                    style={{ width: '100%', marginTop: '16px' }}
                  >
                    {isGenerating ? '⏳ Generating...' : '✨ Generate Content'}
                  </button>
                </div>

                <div className="output-section">
                  <h3>📄 Generated Content</h3>
                  <div 
                    id="generated-content-display"
                    className="generated-content"
                    dangerouslySetInnerHTML={{ __html: generatedContent || '<p>Fill in the product details and click "Generate Content" to get started.</p>' }}
                  />
                  
                  {generatedContent && (
                    <div className="button-group" style={{ marginTop: '16px' }}>
                      <button className="btn btn-secondary" onClick={copyContent}>
                        📋 Copy
                      </button>
                      <button className="btn btn-secondary" onClick={regenerateContent}>
                        🔄 Regenerate
                      </button>
                      <button className="btn btn-secondary" onClick={downloadContent}>
                        💾 Download
                      </button>
                      <button className="btn btn-primary" onClick={viewProjectHistory}>
                        👁️ View Saved
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Marketing Banners Tab */}
          {activeTab === 'banners' && (
            <div className="tab-content active">
              <div className="banner-grid">
                <div className="input-section">
                  <h3>🎨 Banner Design</h3>
                  
                  <div className="form-group">
                    <label>Template Type</label>
                    <select 
                      value={bannerForm.templateType}
                      onChange={(e) => setBannerForm({...bannerForm, templateType: e.target.value})}
                    >
                      <option value="sale">Flash Sale</option>
                      <option value="new">New Arrival</option>
                      <option value="collection">Collection</option>
                      <option value="seasonal">Seasonal</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Main Text</label>
                    <input 
                      type="text" 
                      value={bannerForm.mainText}
                      onChange={(e) => setBannerForm({...bannerForm, mainText: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label>Subtext</label>
                    <input 
                      type="text" 
                      value={bannerForm.subtext}
                      onChange={(e) => setBannerForm({...bannerForm, subtext: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label>Call-to-Action Text</label>
                    <input 
                      type="text" 
                      value={bannerForm.ctaText}
                      onChange={(e) => setBannerForm({...bannerForm, ctaText: e.target.value})}
                    />
                  </div>

                  <div className="color-group">
                    <div className="form-group">
                      <label>Background Color</label>
                      <input 
                        type="color" 
                        value={bannerForm.bgColor}
                        onChange={(e) => setBannerForm({...bannerForm, bgColor: e.target.value})}
                      />
                    </div>

                    <div className="form-group">
                      <label>Text Color</label>
                      <input 
                        type="color" 
                        value={bannerForm.textColor}
                        onChange={(e) => setBannerForm({...bannerForm, textColor: e.target.value})}
                      />
                    </div>

                    <div className="form-group">
                      <label>Accent Color</label>
                      <input 
                        type="color" 
                        value={bannerForm.accentColor}
                        onChange={(e) => setBannerForm({...bannerForm, accentColor: e.target.value})}
                      />
                    </div>
                  </div>

                  <button className="btn btn-primary" onClick={generateBanner} style={{ width: '100%' }}>
                    🎨 Generate Banner
                  </button>
                </div>

                <div className="output-section">
                  <h3>🖼️ Banner Preview</h3>
                  {bannerPreview ? (
                    <div className="banner-preview">
                      <img src={`${API_URL.replace('/api', '')}${bannerPreview}`} alt="Banner" />
                      <button className="btn btn-primary" style={{ marginTop: '16px' }}>
                        ⬇️ Download Banner
                      </button>
                    </div>
                  ) : (
                    <div className="empty-state">
                      <p>Configure your banner settings and click "Generate Banner"</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Catalogue Designer Tab */}
          {activeTab === 'catalogue' && (
            <div className="tab-content active">
              <div className="catalogue-grid">
                <div className="input-section">
                  <h3>📚 Catalogue Information</h3>
                  
                  <div className="form-group">
                    <label>Catalogue Title</label>
                    <input 
                      type="text" 
                      value={catalogueForm.title}
                      onChange={(e) => setCatalogueForm({...catalogueForm, title: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label>Brand Name</label>
                    <input 
                      type="text" 
                      value={catalogueForm.brand}
                      onChange={(e) => setCatalogueForm({...catalogueForm, brand: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label>Primary Color</label>
                    <input 
                      type="color" 
                      value={catalogueForm.catalogueColor}
                      onChange={(e) => setCatalogueForm({...catalogueForm, catalogueColor: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label>Style</label>
                    <select 
                      value={catalogueForm.style}
                      onChange={(e) => setCatalogueForm({...catalogueForm, style: e.target.value})}
                    >
                      <option value="modern">Modern</option>
                      <option value="classic">Classic</option>
                      <option value="minimal">Minimal</option>
                      <option value="luxury">Luxury</option>
                    </select>
                  </div>

                  <button className="btn btn-primary" style={{ width: '100%' }}>
                    📚 Generate Catalogue
                  </button>
                </div>

                <div className="output-section">
                  <h3>📄 Catalogue Preview</h3>
                  <div className="empty-state">
                    <p>Configure your catalogue settings and click "Generate Catalogue"</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}

export default App;

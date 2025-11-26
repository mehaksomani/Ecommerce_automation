import axios from 'axios';

/**
 * AI Content Generator using Hugging Face (FREE API)
 * Get your free API key at: https://huggingface.co/settings/tokens
 * Free tier: 30,000 requests/month
 */

class ContentGenerator {
  constructor() {
    this.apiKey = process.env.HUGGINGFACE_API_KEY;
    this.baseURL = 'https://api-inference.huggingface.co/models';
    
    // Using free, high-quality models
    this.models = {
      text: 'mistralai/Mixtral-8x7B-Instruct-v0.1', // Free, excellent for content generation
      fallback: 'microsoft/DialoGPT-large' // Backup model
    };
  }

  /**
   * Generate product content using AI
   */
  async generateProductContent(params) {
    const {
      productName,
      category,
      features,
      audience,
      tone,
      contentType
    } = params;

    try {
      // If no API key, use template-based generation
      if (!this.apiKey || this.apiKey === 'your_huggingface_api_key_here') {
        console.log('Using template-based content generation (no API key)');
        return this.generateTemplateContent(params);
      }

      // Create prompt based on content type
      const prompt = this.createPrompt(params);

      // Call Hugging Face API
      const response = await axios.post(
        `${this.baseURL}/${this.models.text}`,
        {
          inputs: prompt,
          parameters: {
            max_new_tokens: 500,
            temperature: 0.7,
            top_p: 0.95,
            do_sample: true
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      );

      const generatedText = response.data[0]?.generated_text || '';
      
      // Extract only the generated part (remove prompt)
      const content = generatedText.replace(prompt, '').trim();

      return {
        success: true,
        content: content || this.generateTemplateContent(params).content,
        model: this.models.text,
        source: 'huggingface'
      };

    } catch (error) {
      console.error('Hugging Face API Error:', error.message);
      console.log('Falling back to template-based generation');
      return this.generateTemplateContent(params);
    }
  }

  /**
   * Create AI prompt based on content type
   */
  createPrompt(params) {
    const {
      productName,
      category,
      features,
      audience,
      tone,
      contentType
    } = params;

    const toneDescriptions = {
      professional: 'professional and informative',
      casual: 'friendly and conversational',
      luxury: 'sophisticated and premium',
      playful: 'fun and energetic',
      urgent: 'compelling and action-oriented'
    };

    const baseContext = `Product: ${productName}
Category: ${category || 'General'}
Features: ${features || 'High quality product'}
Target Audience: ${audience || 'General customers'}
Tone: ${toneDescriptions[tone] || 'professional'}`;

    const prompts = {
      description: `${baseContext}

Write a compelling product description that highlights the benefits and features. Make it ${toneDescriptions[tone]}. Length: 2-3 paragraphs.

Product Description:`,

      title: `${baseContext}

Generate 3 catchy product title variations that are SEO-friendly and appealing. Each on a new line.

Titles:`,

      bullets: `${baseContext}

Create 5 compelling bullet points highlighting key features and benefits. Start each with an action verb or benefit.

Key Features:`,

      seo: `${baseContext}

Write an SEO-optimized product description (150-160 characters) and a longer meta description.

SEO Content:`,

      social: `${baseContext}

Create an engaging social media post for Instagram/Facebook. Include emojis and a call-to-action. Keep it exciting!

Social Post:`,

      email: `${baseContext}

Write a promotional email subject line and body content. Make it ${toneDescriptions[tone]} and include a clear CTA.

Email:`,
    };

    return prompts[contentType] || prompts.description;
  }

  /**
   * Template-based content generation (fallback when no API key)
   */
  generateTemplateContent(params) {
    const {
      productName,
      category,
      features,
      audience,
      tone,
      contentType
    } = params;

    const templates = {
      description: this.generateDescription(productName, category, features, audience, tone),
      title: this.generateTitles(productName, category, tone),
      bullets: this.generateBullets(productName, features, tone),
      seo: this.generateSEO(productName, category, features),
      social: this.generateSocial(productName, features, tone),
      email: this.generateEmail(productName, features, tone),
      sizetable: this.generateSizeTable(params.sizeTableType, params.unitType)
    };

    return {
      success: true,
      content: templates[contentType] || templates.description,
      source: 'template'
    };
  }

  generateDescription(name, category, features, audience, tone) {
    const toneStyles = {
      professional: {
        intro: 'Introducing',
        highlight: 'expertly crafted',
        benefit: 'delivers exceptional value'
      },
      casual: {
        intro: 'Check out',
        highlight: 'awesome',
        benefit: 'makes life easier'
      },
      luxury: {
        intro: 'Experience',
        highlight: 'meticulously designed',
        benefit: 'embodies sophistication'
      },
      playful: {
        intro: 'Get ready for',
        highlight: 'super cool',
        benefit: 'brings joy'
      },
      urgent: {
        intro: "Don't miss",
        highlight: 'must-have',
        benefit: 'limited availability'
      }
    };

    const style = toneStyles[tone] || toneStyles.professional;

    return `<h4>${name}</h4>
<p>${style.intro} the ${name} - a ${style.highlight} ${category || 'product'} designed specifically for ${audience || 'discerning customers'}. ${features ? `Featuring ${features}, this exceptional product combines quality with functionality.` : 'Built with attention to detail and premium materials.'}</p>
<p>This ${style.benefit} and exceeds expectations. ${tone === 'luxury' ? 'Experience unparalleled excellence.' : tone === 'urgent' ? 'Order now while supplies last!' : 'Perfect for everyday use and special occasions.'}</p>`;
  }

  generateTitles(name, category, tone) {
    return `<h3>Suggested Product Titles:</h3>
<ul>
  <li><strong>${name}</strong> - Premium ${category || 'Quality'} Product</li>
  <li>${tone === 'luxury' ? 'Exclusive' : 'Best-Selling'} ${name} | ${category || 'Top Rated'}</li>
  <li>${name}: ${tone === 'urgent' ? 'Limited Edition' : 'Professional Grade'} ${category || 'Choice'}</li>
</ul>`;
  }

  generateBullets(name, features, tone) {
    const featureList = features ? features.split(',').map(f => f.trim()) : [];
    const bullets = featureList.length > 0 ? featureList : [
      'Premium quality materials',
      'Durable construction',
      'Easy to use',
      'Versatile applications',
      'Satisfaction guaranteed'
    ];

    return `<h4>Key Features & Benefits:</h4>
<ul>
  ${bullets.slice(0, 5).map(feature => `<li>✓ ${this.capitalizefirst(feature)}</li>`).join('\n  ')}
</ul>`;
  }

  generateSEO(name, category, features) {
    return `<h4>SEO-Optimized Content:</h4>
<p><strong>Meta Title:</strong> ${name} - ${category || 'Premium Quality'} | Free Shipping Available</p>
<p><strong>Meta Description:</strong> Shop ${name} online. ${features || 'High-quality products'} with fast delivery. Best prices guaranteed. Order now!</p>
<p><strong>Keywords:</strong> ${name.toLowerCase()}, ${category?.toLowerCase() || 'quality products'}, buy ${name.toLowerCase()}, ${name.toLowerCase()} online</p>`;
  }

  generateSocial(name, features, tone) {
    const emojis = {
      professional: '✨',
      casual: '🎉',
      luxury: '💎',
      playful: '🌟',
      urgent: '⚡'
    };

    const emoji = emojis[tone] || '✨';

    return `<h4>Social Media Post:</h4>
<div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #6366f1;">
<p>${emoji} Introducing ${name}! ${emoji}</p>
<p>${tone === 'playful' ? '🎊 Get ready to fall in love!' : tone === 'luxury' ? 'Experience sophistication.' : 'Your new favorite product is here!'} ${features ? '✨ ' + features : ''}</p>
<p>${tone === 'urgent' ? '⏰ Limited time offer!' : '💯 Available now!'}</p>
<p>🛍️ Shop now! Link in bio</p>
<p style="color: #6366f1; margin-top: 10px;">#${name.replace(/\s+/g, '')} #${category?.replace(/\s+/g, '') || 'Shopping'} #NewArrival</p>
</div>`;
  }

  generateEmail(name, features, tone) {
    return `<h4>Email Marketing Campaign:</h4>
<div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
<p><strong>Subject Line:</strong> ${tone === 'urgent' ? '⚡ Last Chance!' : '✨'} ${name} - ${tone === 'luxury' ? 'Exclusive Launch' : 'Now Available'}</p>
<p><strong>Preview Text:</strong> ${features || 'Discover something special'}</p>
<hr style="margin: 15px 0; border: none; border-top: 1px solid #ddd;">
<p>Hi there! 👋</p>
<p>We're ${tone === 'urgent' ? 'excited to remind you about' : 'thrilled to introduce'} ${name} - ${features || 'our latest innovation designed with you in mind'}.</p>
<p>${tone === 'urgent' ? '⏰ Limited stock available - don\'t miss out!' : '🌟 Visit our store today to learn more!'}</p>
<p style="margin-top: 20px;">Best regards,<br><strong>Your Brand Team</strong></p>
</div>`;
  }

  generateSizeTable(tableType, unit) {
    // Size table generation logic would go here
    return '<p>Size table generation available</p>';
  }

  capitalizefirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

export default ContentGenerator;

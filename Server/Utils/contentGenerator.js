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


  // ✅ COMPLETE SIZE TABLE IMPLEMENTATION
  generateSizeTable(tableType, unit) {
    if (!tableType) {
      return '<p>Please select a size table type</p>';
    }

    let tableHTML = '<div class="size-guide-header" style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 2px solid #e2e8f0;"><h4 style="margin: 0; color: #1e293b; font-size: 18px;">📏 Size Guide</h4></div>';
    
    const styles = `
      <style>
        .size-table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
          background: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          overflow: hidden;
        }
        .size-table thead {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
        }
        .size-table th {
          padding: 14px 12px;
          text-align: left;
          font-weight: 600;
          font-size: 14px;
        }
        .size-table td {
          padding: 12px;
          border-bottom: 1px solid #e2e8f0;
          font-size: 14px;
          color: #334155;
        }
        .size-table tbody tr:hover {
          background: #f8fafc;
        }
        .size-table tbody tr:last-child td {
          border-bottom: none;
        }
        .size-label {
          font-weight: 600;
          color: #6366f1;
        }
        .measurement-note {
          font-size: 12px;
          color: #64748b;
          font-style: italic;
          margin-top: 8px;
          padding: 12px;
          background: #f8fafc;
          border-radius: 6px;
          border-left: 3px solid #6366f1;
        }
      </style>
    `;
    
    switch(tableType) {
      case 'clothing':
        tableHTML += styles + `
          <table class="size-table">
            <thead>
              <tr>
                <th>Size</th>
                <th>Chest ${unit === 'inches' ? '(in)' : unit === 'cm' ? '(cm)' : '(in/cm)'}</th>
                <th>Waist ${unit === 'inches' ? '(in)' : unit === 'cm' ? '(cm)' : '(in/cm)'}</th>
                <th>Hips ${unit === 'inches' ? '(in)' : unit === 'cm' ? '(cm)' : '(in/cm)'}</th>
                <th>Length ${unit === 'inches' ? '(in)' : unit === 'cm' ? '(cm)' : '(in/cm)'}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="size-label">XS</td>
                <td>${unit === 'cm' ? '81-86' : unit === 'inches' ? '32-34' : '32-34 / 81-86'}</td>
                <td>${unit === 'cm' ? '61-66' : unit === 'inches' ? '24-26' : '24-26 / 61-66'}</td>
                <td>${unit === 'cm' ? '86-91' : unit === 'inches' ? '34-36' : '34-36 / 86-91'}</td>
                <td>${unit === 'cm' ? '69' : unit === 'inches' ? '27' : '27 / 69'}</td>
              </tr>
              <tr>
                <td class="size-label">S</td>
                <td>${unit === 'cm' ? '86-91' : unit === 'inches' ? '34-36' : '34-36 / 86-91'}</td>
                <td>${unit === 'cm' ? '66-71' : unit === 'inches' ? '26-28' : '26-28 / 66-71'}</td>
                <td>${unit === 'cm' ? '91-96' : unit === 'inches' ? '36-38' : '36-38 / 91-96'}</td>
                <td>${unit === 'cm' ? '71' : unit === 'inches' ? '28' : '28 / 71'}</td>
              </tr>
              <tr>
                <td class="size-label">M</td>
                <td>${unit === 'cm' ? '91-96' : unit === 'inches' ? '36-38' : '36-38 / 91-96'}</td>
                <td>${unit === 'cm' ? '71-76' : unit === 'inches' ? '28-30' : '28-30 / 71-76'}</td>
                <td>${unit === 'cm' ? '96-101' : unit === 'inches' ? '38-40' : '38-40 / 96-101'}</td>
                <td>${unit === 'cm' ? '73' : unit === 'inches' ? '29' : '29 / 73'}</td>
              </tr>
              <tr>
                <td class="size-label">L</td>
                <td>${unit === 'cm' ? '96-101' : unit === 'inches' ? '38-40' : '38-40 / 96-101'}</td>
                <td>${unit === 'cm' ? '76-81' : unit === 'inches' ? '30-32' : '30-32 / 76-81'}</td>
                <td>${unit === 'cm' ? '101-106' : unit === 'inches' ? '40-42' : '40-42 / 101-106'}</td>
                <td>${unit === 'cm' ? '75' : unit === 'inches' ? '30' : '30 / 75'}</td>
              </tr>
              <tr>
                <td class="size-label">XL</td>
                <td>${unit === 'cm' ? '101-106' : unit === 'inches' ? '40-42' : '40-42 / 101-106'}</td>
                <td>${unit === 'cm' ? '81-86' : unit === 'inches' ? '32-34' : '32-34 / 81-86'}</td>
                <td>${unit === 'cm' ? '106-111' : unit === 'inches' ? '42-44' : '42-44 / 106-111'}</td>
                <td>${unit === 'cm' ? '77' : unit === 'inches' ? '31' : '31 / 77'}</td>
              </tr>
              <tr>
                <td class="size-label">XXL</td>
                <td>${unit === 'cm' ? '106-111' : unit === 'inches' ? '42-44' : '42-44 / 106-111'}</td>
                <td>${unit === 'cm' ? '86-91' : unit === 'inches' ? '34-36' : '34-36 / 86-91'}</td>
                <td>${unit === 'cm' ? '111-116' : unit === 'inches' ? '44-46' : '44-46 / 111-116'}</td>
                <td>${unit === 'cm' ? '79' : unit === 'inches' ? '32' : '32 / 79'}</td>
              </tr>
            </tbody>
          </table>
          <div class="measurement-note">
            📌 <strong>How to measure:</strong> Chest - Measure around the fullest part. Waist - Measure around natural waistline. Hips - Measure around fullest part of hips. Length - Measure from highest point of shoulder to hem.
          </div>
        `;
        break;

      case 'shoes':
        tableHTML += styles + `
          <table class="size-table">
            <thead>
              <tr>
                <th>US Men</th>
                <th>US Women</th>
                <th>UK</th>
                <th>EU</th>
                <th>Foot Length ${unit === 'inches' ? '(in)' : unit === 'cm' ? '(cm)' : '(in/cm)'}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="size-label">6</td>
                <td>7.5</td>
                <td>5.5</td>
                <td>39</td>
                <td>${unit === 'cm' ? '24.1' : unit === 'inches' ? '9.5' : '9.5 / 24.1'}</td>
              </tr>
              <tr>
                <td class="size-label">7</td>
                <td>8.5</td>
                <td>6</td>
                <td>40</td>
                <td>${unit === 'cm' ? '25.4' : unit === 'inches' ? '10' : '10 / 25.4'}</td>
              </tr>
              <tr>
                <td class="size-label">8</td>
                <td>9.5</td>
                <td>7</td>
                <td>41</td>
                <td>${unit === 'cm' ? '26' : unit === 'inches' ? '10.25' : '10.25 / 26'}</td>
              </tr>
              <tr>
                <td class="size-label">9</td>
                <td>10.5</td>
                <td>8</td>
                <td>42</td>
                <td>${unit === 'cm' ? '27' : unit === 'inches' ? '10.625' : '10.625 / 27'}</td>
              </tr>
              <tr>
                <td class="size-label">10</td>
                <td>11.5</td>
                <td>9</td>
                <td>43</td>
                <td>${unit === 'cm' ? '28' : unit === 'inches' ? '11' : '11 / 28'}</td>
              </tr>
              <tr>
                <td class="size-label">11</td>
                <td>12.5</td>
                <td>10</td>
                <td>44</td>
                <td>${unit === 'cm' ? '29' : unit === 'inches' ? '11.4' : '11.4 / 29'}</td>
              </tr>
              <tr>
                <td class="size-label">12</td>
                <td>13.5</td>
                <td>11</td>
                <td>45</td>
                <td>${unit === 'cm' ? '30' : unit === 'inches' ? '11.8' : '11.8 / 30'}</td>
              </tr>
            </tbody>
          </table>
          <div class="measurement-note">
            📌 <strong>How to measure:</strong> Place your foot on a piece of paper, mark the heel and longest toe, then measure the distance between the two marks.
          </div>
        `;
        break;

      case 'kids':
        tableHTML += styles + `
          <table class="size-table">
            <thead>
              <tr>
                <th>Size</th>
                <th>Age</th>
                <th>Height ${unit === 'inches' ? '(in)' : unit === 'cm' ? '(cm)' : '(in/cm)'}</th>
                <th>Chest ${unit === 'inches' ? '(in)' : unit === 'cm' ? '(cm)' : '(in/cm)'}</th>
                <th>Waist ${unit === 'inches' ? '(in)' : unit === 'cm' ? '(cm)' : '(in/cm)'}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="size-label">2T</td>
                <td>2 years</td>
                <td>${unit === 'cm' ? '86-91' : unit === 'inches' ? '34-36' : '34-36 / 86-91'}</td>
                <td>${unit === 'cm' ? '48-51' : unit === 'inches' ? '19-20' : '19-20 / 48-51'}</td>
                <td>${unit === 'cm' ? '48-51' : unit === 'inches' ? '19-20' : '19-20 / 48-51'}</td>
              </tr>
              <tr>
                <td class="size-label">3T</td>
                <td>3 years</td>
                <td>${unit === 'cm' ? '91-99' : unit === 'inches' ? '36-39' : '36-39 / 91-99'}</td>
                <td>${unit === 'cm' ? '51-53' : unit === 'inches' ? '20-21' : '20-21 / 51-53'}</td>
                <td>${unit === 'cm' ? '51-53' : unit === 'inches' ? '20-21' : '20-21 / 51-53'}</td>
              </tr>
              <tr>
                <td class="size-label">4T</td>
                <td>4 years</td>
                <td>${unit === 'cm' ? '99-107' : unit === 'inches' ? '39-42' : '39-42 / 99-107'}</td>
                <td>${unit === 'cm' ? '53-56' : unit === 'inches' ? '21-22' : '21-22 / 53-56'}</td>
                <td>${unit === 'cm' ? '53-56' : unit === 'inches' ? '21-22' : '21-22 / 53-56'}</td>
              </tr>
              <tr>
                <td class="size-label">5-6</td>
                <td>5-6 years</td>
                <td>${unit === 'cm' ? '107-119' : unit === 'inches' ? '42-47' : '42-47 / 107-119'}</td>
                <td>${unit === 'cm' ? '56-61' : unit === 'inches' ? '22-24' : '22-24 / 56-61'}</td>
                <td>${unit === 'cm' ? '56-58' : unit === 'inches' ? '22-23' : '22-23 / 56-58'}</td>
              </tr>
              <tr>
                <td class="size-label">7-8</td>
                <td>7-8 years</td>
                <td>${unit === 'cm' ? '119-132' : unit === 'inches' ? '47-52' : '47-52 / 119-132'}</td>
                <td>${unit === 'cm' ? '61-66' : unit === 'inches' ? '24-26' : '24-26 / 61-66'}</td>
                <td>${unit === 'cm' ? '58-61' : unit === 'inches' ? '23-24' : '23-24 / 58-61'}</td>
              </tr>
              <tr>
                <td class="size-label">10-12</td>
                <td>10-12 years</td>
                <td>${unit === 'cm' ? '132-152' : unit === 'inches' ? '52-60' : '52-60 / 132-152'}</td>
                <td>${unit === 'cm' ? '66-76' : unit === 'inches' ? '26-30' : '26-30 / 66-76'}</td>
                <td>${unit === 'cm' ? '61-66' : unit === 'inches' ? '24-26' : '24-26 / 61-66'}</td>
              </tr>
            </tbody>
          </table>
          <div class="measurement-note">
            📌 <strong>Note:</strong> Sizes are approximate and can vary by brand. Always refer to specific product measurements for best fit.
          </div>
        `;
        break;

      case 'rings':
        tableHTML += styles + `
          <table class="size-table">
            <thead>
              <tr>
                <th>US/Canada</th>
                <th>UK/Australia</th>
                <th>EU</th>
                <th>Diameter (mm)</th>
                <th>Circumference (mm)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="size-label">5</td>
                <td>J 1/2</td>
                <td>49</td>
                <td>15.7</td>
                <td>49.3</td>
              </tr>
              <tr>
                <td class="size-label">6</td>
                <td>L 1/2</td>
                <td>51</td>
                <td>16.5</td>
                <td>51.9</td>
              </tr>
              <tr>
                <td class="size-label">7</td>
                <td>N 1/2</td>
                <td>54</td>
                <td>17.3</td>
                <td>54.4</td>
              </tr>
              <tr>
                <td class="size-label">8</td>
                <td>P 1/2</td>
                <td>57</td>
                <td>18.1</td>
                <td>57.0</td>
              </tr>
              <tr>
                <td class="size-label">9</td>
                <td>R 1/2</td>
                <td>59</td>
                <td>19.0</td>
                <td>59.5</td>
              </tr>
              <tr>
                <td class="size-label">10</td>
                <td>T 1/2</td>
                <td>62</td>
                <td>19.8</td>
                <td>62.1</td>
              </tr>
            </tbody>
          </table>
          <div class="measurement-note">
            📌 <strong>How to measure:</strong> Wrap a string around your finger, mark where it overlaps, measure the length in mm for circumference, or measure an existing ring's inner diameter.
          </div>
        `;
        break;

      case 'international':
        tableHTML += styles + `
          <table class="size-table">
            <thead>
              <tr>
                <th>US</th>
                <th>UK</th>
                <th>EU</th>
                <th>Japan</th>
                <th>China</th>
                <th>Chest ${unit === 'inches' ? '(in)' : unit === 'cm' ? '(cm)' : '(in/cm)'}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="size-label">XS</td>
                <td>6-8</td>
                <td>34-36</td>
                <td>7-9</td>
                <td>160/80A</td>
                <td>${unit === 'cm' ? '81-86' : unit === 'inches' ? '32-34' : '32-34 / 81-86'}</td>
              </tr>
              <tr>
                <td class="size-label">S</td>
                <td>8-10</td>
                <td>36-38</td>
                <td>9-11</td>
                <td>165/84A</td>
                <td>${unit === 'cm' ? '86-91' : unit === 'inches' ? '34-36' : '34-36 / 86-91'}</td>
              </tr>
              <tr>
                <td class="size-label">M</td>
                <td>10-12</td>
                <td>38-40</td>
                <td>11-13</td>
                <td>170/88A</td>
                <td>${unit === 'cm' ? '91-96' : unit === 'inches' ? '36-38' : '36-38 / 91-96'}</td>
              </tr>
              <tr>
                <td class="size-label">L</td>
                <td>12-14</td>
                <td>40-42</td>
                <td>13-15</td>
                <td>175/92A</td>
                <td>${unit === 'cm' ? '96-101' : unit === 'inches' ? '38-40' : '38-40 / 96-101'}</td>
              </tr>
              <tr>
                <td class="size-label">XL</td>
                <td>14-16</td>
                <td>42-44</td>
                <td>15-17</td>
                <td>180/96A</td>
                <td>${unit === 'cm' ? '101-106' : unit === 'inches' ? '40-42' : '40-42 / 101-106'}</td>
              </tr>
            </tbody>
          </table>
          <div class="measurement-note">
            📌 <strong>Note:</strong> International sizing varies by country and brand. Always check specific product measurements for accuracy.
          </div>
        `;
        break;

      default:
        tableHTML += '<p>Invalid size table type. Please select from: clothing, shoes, kids, rings, or international.</p>';
    }

    return tableHTML;
  }

  capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

export default ContentGenerator;
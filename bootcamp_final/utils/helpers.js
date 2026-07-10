// Frontend Utilities - utils/helpers.js
// Bu faylı HTML-də <script src="utils/helpers.js"></script> ilə yüklə

/**
 * Email validasiyası
 * @param {string} email 
 * @returns {boolean}
 */
export function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Şifrə güclü olub olmadığını yoxla
 * @param {string} password 
 * @returns {object} { isStrong: boolean, issues: array }
 */
export function validatePassword(password) {
    const issues = [];

    if (password.length < 8) {
        issues.push('Şifrə ən azı 8 simvol olmalıdır');
    }

    if (!/[a-z]/.test(password)) {
        issues.push('Kiçik hərf olmalıdır (a-z)');
    }

    if (!/[A-Z]/.test(password)) {
        issues.push('Böyük hərf olmalıdır (A-Z)');
    }

    if (!/\d/.test(password)) {
        issues.push('Rəqəm olmalıdır (0-9)');
    }

    if (!/[!@#$%^&*]/.test(password)) {
        issues.push('Xüsusi simvol olmalıdır (!@#$%^&*)');
    }

    return {
        isStrong: issues.length === 0,
        issues: issues
    };
}

/**
 * Token-i localStorage-dən al
 * @returns {string|null}
 */
export function getAuthToken() {
    return localStorage.getItem('authToken');
}

/**
 * Token-i localStorage-də saxla
 * @param {string} token 
 */
export function setAuthToken(token) {
    localStorage.setItem('authToken', token);
}

/**
 * Token-i localStorage-dən sil
 */
export function removeAuthToken() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
}

/**
 * Token-i decode et (JWT)
 * @param {string} token 
 * @returns {object|null}
 */
export function decodeToken(token) {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;

        const payload = JSON.parse(atob(parts[1]));
        return payload;
    } catch (error) {
        return null;
    }
}

/**
 * Token'ın vaxtı keçibmi yoxla
 * @param {string} token 
 * @returns {boolean}
 */
export function isTokenExpired(token) {
    const payload = decodeToken(token);
    if (!payload || !payload.exp) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
}

/**
 * İstifadəçi autentifikasiya olubsa yoxla
 * @returns {boolean}
 */
export function isAuthenticated() {
    const token = getAuthToken();
    if (!token) return false;
    return !isTokenExpired(token);
}

/**
 * Protektə olunmuş səhifəyə yönləndir
 * @param {string} redirectPath 
 */
export function redirectIfNotAuthenticated(redirectPath = '/index.html') {
    if (!isAuthenticated()) {
        window.location.href = redirectPath;
    }
}

/**
 * API çağırış
 * @param {string} endpoint 
 * @param {object} options 
 * @returns {Promise}
 */
export async function fetchAPI(endpoint, options = {}) {
    const baseUrl = window.location.origin;
    const url = baseUrl + endpoint;

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    // Auth token əlavə et
    const token = getAuthToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(url, {
            ...options,
            headers
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'API xətası');
        }

        return {
            success: true,
            data: data,
            status: response.status
        };

    } catch (error) {
        return {
            success: false,
            error: error.message,
            status: 0
        };
    }
}

/**
 * Form məlumatını validate et
 * @param {object} formData 
 * @param {array} rules 
 * @returns {object}
 */
export function validateForm(formData, rules) {
    const errors = {};

    for (const [field, rule] of Object.entries(rules)) {
        const value = formData[field];

        if (rule.required && (!value || value.trim() === '')) {
            errors[field] = `${rule.label || field} tələb olunur`;
            continue;
        }

        if (rule.type === 'email' && value && !isValidEmail(value)) {
            errors[field] = 'Keçərli email daxil edin';
        }

        if (rule.type === 'password' && value) {
            const validation = validatePassword(value);
            if (!validation.isStrong) {
                errors[field] = validation.issues[0];
            }
        }

        if (rule.minLength && value && value.length < rule.minLength) {
            errors[field] = `${rule.label || field} ən azı ${rule.minLength} simvol olmalıdır`;
        }

        if (rule.maxLength && value && value.length > rule.maxLength) {
            errors[field] = `${rule.label || field} maksimum ${rule.maxLength} simvol ola bilər`;
        }

        if (rule.pattern && value && !rule.pattern.test(value)) {
            errors[field] = rule.patternMessage || 'Yanlış format';
        }
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors: errors
    };
}

/**
 * CSS sinfini əlavə et
 * @param {HTMLElement} element 
 * @param {string} className 
 */
export function addClass(element, className) {
    if (element && !element.classList.contains(className)) {
        element.classList.add(className);
    }
}

/**
 * CSS sinfini sil
 * @param {HTMLElement} element 
 * @param {string} className 
 */
export function removeClass(element, className) {
    if (element && element.classList.contains(className)) {
        element.classList.remove(className);
    }
}

/**
 * Element göstər
 * @param {HTMLElement} element 
 */
export function show(element) {
    if (element) {
        element.style.display = 'block';
    }
}

/**
 * Element gizlət
 * @param {HTMLElement} element 
 */
export function hide(element) {
    if (element) {
        element.style.display = 'none';
    }
}

/**
 * Mesaj göstər
 * @param {string} message 
 * @param {string} type 'success', 'error', 'warning', 'info'
 * @param {number} duration 
 */
export function showMessage(message, type = 'info', duration = 3000) {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 6px;
        font-size: 14px;
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;


    if (type === 'success') {
        messageDiv.style.background = '#28a745';
        messageDiv.style.color = 'white';
    } else if (type === 'error') {
        messageDiv.style.background = '#dc3545';
        messageDiv.style.color = 'white';
    } else if (type === 'warning') {
        messageDiv.style.background = '#ffc107';
        messageDiv.style.color = 'black';
    } else {
        messageDiv.style.background = '#17a2b8';
        messageDiv.style.color = 'white';
    }

    document.body.appendChild(messageDiv);

    setTimeout(() => {
        messageDiv.remove();
    }, duration);
}

/**
 * Saat formatı
 * @param {Date} date 
 * @returns {string}
 */
export function formatDate(date) {
    return new Date(date).toLocaleDateString('az-AZ', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Saatı formatla
 * @param {Date} date 
 * @returns {string}
 */
export function formatDateTime(date) {
    return new Date(date).toLocaleString('az-AZ', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Delay (async)
 * @param {number} ms 
 * @returns {Promise}
 */
export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * URL parametrəsini al
 * @param {string} paramName 
 * @returns {string|null}
 */
export function getURLParam(paramName) {
    const params = new URLSearchParams(window.location.search);
    return params.get(paramName);
}

/**
 * Cihazın mobil olub olmadığını yoxla
 * @returns {boolean}
 */
export function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
    );
}

export default {
    isValidEmail,
    validatePassword,
    getAuthToken,
    setAuthToken,
    removeAuthToken,
    decodeToken,
    isTokenExpired,
    isAuthenticated,
    redirectIfNotAuthenticated,
    fetchAPI,
    validateForm,
    addClass,
    removeClass,
    show,
    hide,
    showMessage,
    formatDate,
    formatDateTime,
    delay,
    getURLParam,
    isMobile
};

// PROACTIVA Communications Dashboard - Shared Component
// This file contains all dashboard functionality used by both research pages

// Dashboard Manager for unified data handling
class DashboardManager {
    static generateStats(submissions) {
        const today = new Date();
        const todaySubmissions = submissions.filter(sub => {
            const subDate = new Date(sub.timestamp);
            return subDate.toDateString() === today.toDateString();
        });
        
        const thisWeek = submissions.filter(sub => {
            const subDate = new Date(sub.timestamp);
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            return subDate >= weekAgo;
        });

        return {
            total: submissions.length,
            today: todaySubmissions.length,
            thisWeek: thisWeek.length,
            lastSubmission: submissions.length > 0 ? 
                new Date(submissions[submissions.length - 1].timestamp).toLocaleDateString() : 'N/A'
        };
    }

    static renderStats(stats, container) {
        if (!container) return;
        
        container.innerHTML = `
            <div class="stat-card">
                <div class="stat-number">${stats.total}</div>
                <div class="stat-label">Total Submissions</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.today}</div>
                <div class="stat-label">Today</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.thisWeek}</div>
                <div class="stat-label">This Week</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" style="font-size: 18px;">${stats.lastSubmission}</div>
                <div class="stat-label">Last Submission</div>
            </div>
        `;
    }

    static renderEmptyState(container) {
        if (!container) return;
        
        container.innerHTML = `
            <div class="no-submissions">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1" style="margin-bottom: 20px;">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <div>No access requests yet.</div>
                <div style="font-size: 14px; color: #999; margin-top: 10px;">Submissions will appear here when users request access.</div>
            </div>
        `;
    }

    static renderSubmissionsTable(submissions, container) {
        if (!container) return;
        
        const tableHTML = `
            <table class="submissions-table">
                <thead>
                    <tr>
                        <th>Date/Time</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Organization</th>
                        <th>Type</th>
                    </tr>
                </thead>
                <tbody>
                    ${submissions.map((sub, index) => {
                        const date = new Date(sub.timestamp);
                        const dateStr = date.toLocaleDateString();
                        const timeStr = date.toLocaleTimeString();
                        const isContactForm = sub.formType === 'contact' || sub.role === 'Contact Form Submission';
                        
                        return `
                            <tr>
                                <td>
                                    <div style="font-weight: 600;">${dateStr}</div>
                                    <div style="font-size: 12px; color: #666;">${timeStr}</div>
                                </td>
                                <td style="font-weight: 500;">${escapeHtml(sub.name)}</td>
                                <td><a href="mailto:${escapeHtml(sub.email)}" style="color: #0066cc;">${escapeHtml(sub.email)}</a></td>
                                <td>${escapeHtml(sub.organization || 'Not specified')}</td>
                                <td>
                                    ${isContactForm ? 
                                        `<span style="color: #e74c3c; font-weight: 500;">Contact Form</span><br>
                                        <button onclick="showContactMessage(${index})" style="color: #0066cc; background: none; border: none; text-decoration: underline; cursor: pointer; font-size: 12px;">View message</button>` 
                                        : `<span style="color: #0066cc; font-weight: 500;">Access Request</span>`
                                    }
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        `;
        
        container.innerHTML = tableHTML;
    }

    static showContactMessage(index) {
        const submissions = this.loadSubmissions();
        const submission = submissions[index];
        
        if (!submission || submission.formType !== 'contact') return;
        
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            padding: 20px;
        `;
        
        modal.innerHTML = `
            <div style="background: white; padding: 30px; border-radius: 12px; max-width: 600px; width: 100%; max-height: 80vh; overflow-y: auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h3 style="margin: 0; color: #1a1a1a;">Contact Form Message</h3>
                    <button onclick="this.closest('div').parentNode.remove()" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #666;">&times;</button>
                </div>
                <div style="margin-bottom: 15px;">
                    <strong>From:</strong> ${escapeHtml(submission.name)} (${escapeHtml(submission.email)})
                </div>
                <div style="margin-bottom: 15px;">
                    <strong>Organization:</strong> ${escapeHtml(submission.organization || 'Not specified')}
                </div>
                <div style="margin-bottom: 15px;">
                    <strong>Subject:</strong> ${escapeHtml(submission.subject || 'No subject')}
                </div>
                <div style="margin-bottom: 15px;">
                    <strong>Date:</strong> ${new Date(submission.timestamp).toLocaleString()}
                </div>
                <div style="margin-bottom: 15px;">
                    <strong>Message:</strong>
                </div>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border: 1px solid #dee2e6; white-space: pre-wrap; font-family: inherit; line-height: 1.5;">
                    ${escapeHtml(submission.message || 'No message content')}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    static loadSubmissions() {
        try {
            return JSON.parse(localStorage.getItem('proactivaSubmissions') || '[]');
        } catch (error) {
            console.error('Error loading submissions:', error);
            return [];
        }
    }
}

// Data Export Manager for CSV download and data clearing
class DataExportManager {
    static escapeCSV(str) {
        return `"${(str || '').replace(/"/g, '""')}"`;
    }

    static downloadSubmissionsCSV() {
        try {
            const submissions = JSON.parse(localStorage.getItem('proactivaSubmissions') || '[]');
            
            if (submissions.length === 0) {
                alert('No submissions to download.');
                return;
            }
            
            const headers = ['Date', 'Time', 'Name', 'Email', 'Organization', 'Role', 'User Agent', 'Referrer'].join(',');
            const rows = submissions.map(sub => {
                const date = new Date(sub.timestamp);
                return [
                    date.toLocaleDateString(),
                    date.toLocaleTimeString(),
                    this.escapeCSV(sub.name),
                    this.escapeCSV(sub.email),
                    this.escapeCSV(sub.organization),
                    this.escapeCSV(sub.role),
                    this.escapeCSV(sub.userAgent),
                    this.escapeCSV(sub.referrer)
                ].join(',');
            }).join('\n');
            
            const csvContent = headers + '\n' + rows;
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            
            a.href = url;
            a.download = `proactiva-submissions-${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            console.log('CSV downloaded successfully');
        } catch (error) {
            console.error('Error downloading CSV:', error);
            alert('Error downloading submissions. Please try again.');
        }
    }

    static clearAllSubmissions() {
        if (confirm('Are you sure you want to clear all submission data? This action cannot be undone.')) {
            try {
                localStorage.removeItem('proactivaSubmissions');
                if (typeof loadSubmissionsData === 'function') {
                    loadSubmissionsData();
                }
                alert('All submissions have been cleared.');
                console.log('All submissions cleared');
            } catch (error) {
                console.error('Error clearing submissions:', error);
                alert('Error clearing submissions. Please try again.');
            }
        }
    }
}

// Global Functions - Available to both pages
function loadSubmissionsData() {
    try {
        const submissions = DashboardManager.loadSubmissions();
        const content = document.getElementById('submissionsContent');
        const statsContainer = document.getElementById('dashboardStats');
        
        if (!content) return;
        
        // Generate and render stats
        const stats = DashboardManager.generateStats(submissions);
        DashboardManager.renderStats(stats, statsContainer);
        
        // Render content
        if (submissions.length === 0) {
            DashboardManager.renderEmptyState(content);
        } else {
            DashboardManager.renderSubmissionsTable(submissions, content);
        }
        
        // Auto-refresh data every 30 seconds when dashboard is visible
        if (document.getElementById('adminDashboard').style.display === 'block') {
            setTimeout(() => loadSubmissionsData(), 30000);
        }
    } catch (error) {
        console.error('Error loading submissions:', error);
        const content = document.getElementById('submissionsContent');
        if (content) {
            content.innerHTML = '<div class="no-submissions" style="color: #e74c3c;">Error loading submissions data.</div>';
        }
    }
}

function showContactMessage(index) {
    DashboardManager.showContactMessage(index);
}

function downloadSubmissionsCSV() {
    DataExportManager.downloadSubmissionsCSV();
}

function clearAllSubmissions() {
    DataExportManager.clearAllSubmissions();
}

// Utility function needed by the dashboard
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
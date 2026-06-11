import { useMeta } from '../hooks/useMeta'
import { Calendar, AlertCircle, ExternalLink, ArrowRight, BookOpen, Clock, CheckCircle } from 'lucide-react'
import './HelpPage.css'

const CAP_STEPS = [
  {
    num: 1,
    title: 'MHT-CET / JEE Results',
    status: 'Completed',
    desc: 'The State CET Cell declares the scorecard containing subject-wise percentiles. Keep your examination log-in details safe.'
  },
  {
    num: 2,
    title: 'Registration & Document Upload',
    status: 'Upcoming',
    desc: 'Register online on the official CAP portal. Scan and upload caste validity, non-creamy layer, domicile, and EWS certificates.'
  },
  {
    num: 3,
    title: 'Document Verification & E-Scrutiny',
    status: 'Upcoming',
    desc: 'Select e-scrutiny (digital) or physical verification. Facilitation Centers (FC) verify original documents to approve candidacy.'
  },
  {
    num: 4,
    title: 'Provisional Merit List Release',
    status: 'Upcoming',
    desc: 'A draft merit list is published showing candidate names, details, and initial state merit/category ranks.'
  },
  {
    num: 5,
    title: 'Grievance Submission Period',
    status: 'Upcoming',
    desc: 'A 2-3 day window to correct errors (caste category mismatches, misspelled names) by uploading corrected documents.'
  },
  {
    num: 6,
    title: 'Final Merit List & Seat Matrix',
    status: 'Upcoming',
    desc: 'The official Final State/Category Merit Ranks are issued. The final count of vacant seats per branch is released.'
  },
  {
    num: 7,
    title: 'CAP Round 1 Option Form Filling',
    status: 'Upcoming',
    desc: 'Submit your college choices in order of preference. Use FutureU to sort and list options (hardest to easiest).'
  },
  {
    num: 8,
    title: 'CAP Round 1 Allotment',
    status: 'Upcoming',
    desc: 'First seat allotment is published. Accept and freeze to secure the seat, or choose float/slide to participate in Round 2.'
  },
  {
    num: 9,
    title: 'CAP Round 2 & 3 Upgrades',
    status: 'Upcoming',
    desc: 'Participate in upgrade rounds to try and secure a higher-priority choice. Cutoff levels will fluctuate.'
  },
  {
    num: 10,
    title: 'Reporting & Admission Finalization',
    status: 'Upcoming',
    desc: 'Report to your allotted institute physically, submit original papers, pay fees, and finalize your engineering admission.'
  }
]

export default function HelpPage() {
  useMeta(
    'Student Help & CAP 2026 Schedule | FutureU',
    'Understand the Maharashtra engineering CAP admission process. View the step-by-step CAP schedule, guidelines, and direct portals.'
  )

  return (
    <div className="help-page">
      <div className="container help-container">
        {/* Header Section */}
        <header className="help-header">
          <h1 className="help-title">Admission Guide & <span>CAP Flow</span></h1>
          <p className="help-lead">
            A step-by-step roadmap of the MHT-CET Centralized Admission Process (CAP) to help you finalize your engineering admission.
          </p>
        </header>

        {/* Warning Alert banner */}
        <div className="help-alert-banner">
          <AlertCircle size={20} className="alert-icon-red" />
          <div className="alert-content">
            <strong>Important Notice:</strong> Official schedule dates for the <strong>2026-27 admission cycle</strong> have not yet been announced by the State CET Cell. The timeline below highlights the expected flow. Please monitor the official CET Cell portal for binding updates.
            <a href="https://cetcell.mahacet.org/" target="_blank" rel="noopener noreferrer" className="alert-link">
              Go to Official CET Cell Website <ExternalLink size={12} />
            </a>
          </div>
        </div>

        <hr className="help-divider" />

        {/* Timeline Grid layout */}
        <div className="help-timeline-section">
          <h2>The 10 Stages of CAP</h2>
          <p className="section-sub">Understand each step of the centralized allocation process to avoid common mistakes.</p>

          <div className="help-timeline">
            {CAP_STEPS.map((step, idx) => (
              <div key={step.num} className="help-timeline-item">
                <div className="help-timeline-marker">
                  <div className={`help-marker-num ${step.status === 'Completed' ? 'done' : ''}`}>
                    {step.num}
                  </div>
                  {idx < CAP_STEPS.length - 1 && <div className="help-marker-line"></div>}
                </div>

                <div className="help-timeline-content">
                  <div className="help-step-header">
                    <h3>{step.title}</h3>
                    <span className={`status-pill status-${step.status.toLowerCase()}`}>
                      {step.status === 'Completed' ? <CheckCircle size={10} style={{ marginRight: 4 }} /> : <Clock size={10} style={{ marginRight: 4 }} />}
                      {step.status}
                    </span>
                  </div>
                  <p>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <hr className="help-divider" />

        {/* Useful resources */}
        <section className="resources-section">
          <h2>Important Publications & Resources</h2>
          <p className="section-sub">Always verify cutoff ranks and seat codes directly from the official publications.</p>
          
          <div className="resources-grid">
            <a href="https://cetcell.mahacet.org/" target="_blank" rel="noopener noreferrer" className="resource-card">
              <BookOpen className="card-icon" />
              <div>
                <h4>CET Cell Portal</h4>
                <p>Register, upload documents, and submit your official option forms here.</p>
              </div>
              <ArrowRight className="card-arrow" />
            </a>

            <a href="https://cetcell.mahacet.org/" target="_blank" rel="noopener noreferrer" className="resource-card">
              <Calendar className="card-icon" />
              <div>
                <h4>Official Schedule Announcements</h4>
                <p>Track binding dates, registrations, and CAP round results sheets.</p>
              </div>
              <ArrowRight className="card-arrow" />
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}

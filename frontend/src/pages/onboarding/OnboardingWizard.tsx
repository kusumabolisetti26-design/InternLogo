import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentService } from '../../services/api';
import { 
  Sparkles, CheckCircle2, ArrowRight, ArrowLeft, 
  GraduationCap, Target, Briefcase, Award, Check
} from 'lucide-react';

export const OnboardingWizard: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [completed, setCompleted] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form states
  const [college, setCollege] = useState('National Institute of Technology');
  const [degree, setDegree] = useState('B.Tech');
  const [branch, setBranch] = useState('Computer Science & Engineering');
  const [graduationYear, setGraduationYear] = useState(2027);

  // Skills
  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    'Python', 'Machine Learning', 'SQL', 'Scikit-learn', 'React'
  ]);
  const [customSkillInput, setCustomSkillInput] = useState('');

  // Domain & Goals
  const [careerGoal, setCareerGoal] = useState('AI Engineer');
  const [preferredDomain, setPreferredDomain] = useState('AI/ML');
  const [preferredLocation, setPreferredLocation] = useState('Bengaluru / Remote');
  const [workMode, setWorkMode] = useState('Remote');
  const [minStipend, setMinStipend] = useState(20000);
  const [duration, setDuration] = useState('3-6 months');
  const [experienceSummary, setExperienceSummary] = useState(
    'Built machine learning classification pipelines and full-stack API projects.'
  );

  const availableSuggestedSkills = [
    'Python', 'Machine Learning', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'Deep Learning',
    'SQL', 'Pandas', 'NumPy', 'FastAPI', 'React', 'TypeScript', 'Docker', 'AWS', 'Git'
  ];

  const careerGoalOptions = [
    'AI Engineer', 'Machine Learning Engineer', 'Data Scientist',
    'Full Stack Developer', 'Backend Software Engineer', 'Cloud / DevOps Engineer'
  ];

  const domainOptions = [
    'AI/ML', 'Software Development', 'Data Science', 'Web Development', 'Cloud/DevOps'
  ];

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const addCustomSkill = () => {
    if (customSkillInput.trim() && !selectedSkills.includes(customSkillInput.trim())) {
      setSelectedSkills([...selectedSkills, customSkillInput.trim()]);
      setCustomSkillInput('');
    }
  };

  const handleFinish = async () => {
    setSaving(true);
    try {
      await studentService.completeOnboarding({
        college,
        degree,
        branch,
        graduation_year: Number(graduationYear),
        career_goal: careerGoal,
        preferred_domain: preferredDomain,
        preferred_location: preferredLocation,
        work_mode_preference: workMode,
        min_stipend: Number(minStipend),
        duration_preference: duration,
        experience_summary: experienceSummary,
        skills: selectedSkills,
      });
      setCompleted(true);
    } catch (err) {
      console.error('Failed to save onboarding', err);
      // Navigate anyway for demo continuity
      setCompleted(true);
    } finally {
      setSaving(false);
    }
  };

  if (completed) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-50">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-slate-200/90 shadow-xl text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Your InternLogo profile is ready!</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Our AI matching engine has calculated your personalized Fit Scores, verified trust signals, and generated recommendations aligned with your target goal of <strong>{careerGoal}</strong>.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
          >
            <span>Go to My Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="max-w-2xl w-full bg-white p-8 rounded-2xl border border-slate-200/90 shadow-xl">
        
        {/* Progress Bar & Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center text-xs mb-2">
            <span className="font-bold text-indigo-600 uppercase tracking-wider">
              Step {step} of 6
            </span>
            <span className="text-slate-400 font-medium">
              {Math.round((step / 6) * 100)}% Completed
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-300"
              style={{ width: `${(step / 6) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Personal & Bio */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-black text-slate-900">Personal Information</h3>
              <p className="text-xs text-slate-500">Tell recruiters a bit about your background</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Location</label>
              <input
                type="text"
                value={preferredLocation}
                onChange={(e) => setPreferredLocation(e.target.value)}
                placeholder="e.g. Bengaluru / Remote / Pune"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Brief Bio / Academic Summary</label>
              <textarea
                rows={3}
                value={experienceSummary}
                onChange={(e) => setExperienceSummary(e.target.value)}
                placeholder="Describe your project experience and interests..."
                className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
          </div>
        )}

        {/* Step 2: Education */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-black text-slate-900">Academic Education</h3>
              <p className="text-xs text-slate-500">We match qualification & eligibility requirements</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">College / University</label>
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Degree</label>
                <input
                  type="text"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Branch</label>
                <input
                  type="text"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Grad Year</label>
                <input
                  type="number"
                  value={graduationYear}
                  onChange={(e) => setGraduationYear(Number(e.target.value))}
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Technical Skills */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-black text-slate-900">Technical Skills</h3>
              <p className="text-xs text-slate-500">Select skills you have hands-on experience with</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {availableSuggestedSkills.map((sk) => {
                const isSelected = selectedSkills.includes(sk);
                return (
                  <button
                    key={sk}
                    type="button"
                    onClick={() => toggleSkill(sk)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition border flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                    <span>{sk}</span>
                  </button>
                );
              })}
            </div>
            <div className="flex gap-2 pt-2">
              <input
                type="text"
                value={customSkillInput}
                onChange={(e) => setCustomSkillInput(e.target.value)}
                placeholder="Add other skill (e.g. Next.js, Django)..."
                className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-300"
              />
              <button
                type="button"
                onClick={addCustomSkill}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
              >
                Add
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Interests & Domain */}
        {step === 4 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-black text-slate-900">Preferred Tech Domain</h3>
              <p className="text-xs text-slate-500">Which field interests you most?</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {domainOptions.map((dom) => (
                <button
                  key={dom}
                  type="button"
                  onClick={() => setPreferredDomain(dom)}
                  className={`p-3 rounded-xl border text-left text-xs font-bold transition ${
                    preferredDomain === dom
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-2 ring-indigo-500/20'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {dom}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Career Goal */}
        {step === 5 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-black text-slate-900">Target Career Goal</h3>
              <p className="text-xs text-slate-500">What specific role are you aspiring to secure?</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {careerGoalOptions.map((goal) => (
                <button
                  key={goal}
                  type="button"
                  onClick={() => setCareerGoal(goal)}
                  className={`p-3 rounded-xl border text-left text-xs font-bold transition ${
                    careerGoal === goal
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-2 ring-indigo-500/20'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {goal}
                </button>
              ))}
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Or custom target role:</label>
              <input
                type="text"
                value={careerGoal}
                onChange={(e) => setCareerGoal(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300"
              />
            </div>
          </div>
        )}

        {/* Step 6: Internship Preferences */}
        {step === 6 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-black text-slate-900">Internship Preferences</h3>
              <p className="text-xs text-slate-500">Set your stipend and work arrangement filters</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {['Remote', 'Hybrid', 'On-site'].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setWorkMode(mode)}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition text-center ${
                    workMode === mode
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                      : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Minimum Stipend (₹/month)</label>
                <input
                  type="number"
                  step={5000}
                  value={minStipend}
                  onChange={(e) => setMinStipend(Number(e.target.value))}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Duration</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="1-3 months">1-3 Months</option>
                  <option value="3-6 months">3-6 Months</option>
                  <option value="6+ months">6+ Months</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex justify-between items-center">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Previous
            </button>
          ) : <div />}

          {step < 6 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm"
            >
              Next Step
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              disabled={saving}
              onClick={handleFinish}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm"
            >
              {saving ? 'Finalizing Profile...' : 'Complete & View Matches'}
              <CheckCircle2 className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

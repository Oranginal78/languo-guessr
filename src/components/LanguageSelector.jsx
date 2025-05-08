import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import bg7 from '../images/fond7.png';
import './LanguageSelector.css';

const languagesList = [
    { en: 'Arabic', fr: 'Arabe' }, { en: 'Bengali', fr: 'Bengali' }, { en: 'Bulgarian', fr: 'Bulgare' },
    { en: 'Cantonese', fr: 'Cantonais' }, { en: 'Chinese', fr: 'Chinois' }, { en: 'Croatian', fr: 'Croate' },
    { en: 'Czech', fr: 'Tchèque' }, { en: 'Danish', fr: 'Danois' }, { en: 'Dutch', fr: 'Néerlandais' },
    { en: 'Finnish', fr: 'Finnois' }, { en: 'French', fr: 'Français' }, { en: 'German', fr: 'Allemand' },
    { en: 'Greek', fr: 'Grec' }, { en: 'Hebrew', fr: 'Hébreu' }, { en: 'Hindi', fr: 'Hindi' },
    { en: 'Hmong', fr: 'Hmong' }, { en: 'Hungarian', fr: 'Hongrois' }, { en: 'Indonesian', fr: 'Indonésien' },
    { en: 'Italian', fr: 'Italien' }, { en: 'Japanese', fr: 'Japonais' }, { en: 'Kannada', fr: 'Kannada' },
    { en: 'Kurdish', fr: 'Kurde' }, { en: 'Malayalam', fr: 'Malayalam' }, { en: 'Norwegian', fr: 'Norvégien' },
    { en: 'Polish', fr: 'Polonais' }, { en: 'Portuguese', fr: 'Portugais' }, { en: 'Punjabi', fr: 'Pendjabi' },
    { en: 'Romanian', fr: 'Roumain' }, { en: 'Russian', fr: 'Russe' }, { en: 'Serbian', fr: 'Serbe' },
    { en: 'Sinhala', fr: 'Cinghalais' }, { en: 'Spanish', fr: 'Espagnol' }, { en: 'Swahili', fr: 'Swahili' },
    { en: 'Swedish', fr: 'Suédois' }, { en: 'Tagalog', fr: 'Tagalog' }, { en: 'Thai', fr: 'Thaïlandais' },
    { en: 'Turkish', fr: 'Turc' }, { en: 'Ukrainian', fr: 'Ukrainien' }, { en: 'Vietnamese', fr: 'Vietnamien' },
].sort((a, b) => a.en.localeCompare(b.en));

function LanguageSelector({ onValidate }) {
    const [selectedLanguages, setSelectedLanguages] = useState([]);
    const [difficulty, setDifficulty] = useState('normal');
    const [uiLanguage, setUiLanguage] = useState('en');

    const toggleLanguage = (language) => {
        if (selectedLanguages.includes(language.en)) {
            setSelectedLanguages(selectedLanguages.filter(l => l !== language.en));
        } else {
            setSelectedLanguages([...selectedLanguages, language.en]);
        }
    };

    const selectAll = () => setSelectedLanguages(languagesList.map(lang => lang.en));
    const unselectAll = () => setSelectedLanguages([]);

    const handleSubmit = () => {
        if (selectedLanguages.length >= 3) {
            if (onValidate) {
                onValidate(selectedLanguages, difficulty, uiLanguage);
            }
        } else {
            alert(uiLanguage === 'en'
                ? 'Please select at least 3 languages.'
                : 'Veuillez sélectionner au moins 3 langues.');
        }
    };

    return (
        <div className="language-selector-page" style={{ backgroundImage: `url(${bg7})` }}>
            <div className="center-top-link">
                <Link to="/about" className="lab-link-button">Oranginal AI Lab</Link>
            </div>

            <div className="selector-glass-box">
                <h1 className="selector-title">Languo Guessr</h1>

                {/* UI Language */}
                <div className="option-line">
                    <div className="option-title">
                        {uiLanguage === 'en' ? 'Choose UI Language' : 'Choisissez la langue du jeu'}
                    </div>
                    <div className="selector-buttons">
                        <button onClick={() => setUiLanguage('en')} className={`selector-button ${uiLanguage === 'en' ? 'active' : ''}`}>English</button>
                        <button onClick={() => setUiLanguage('fr')} className={`selector-button ${uiLanguage === 'fr' ? 'active' : ''}`}>Français</button>
                    </div>
                </div>

                {/* Difficulty */}
                <div className="option-line">
                    <div className="option-title">
                        {uiLanguage === 'en' ? 'Select Difficulty' : 'Sélectionnez la difficulté'}
                    </div>
                    <div className="selector-buttons">
                        {['easy', 'normal', 'hard'].map(level => (
                            <button
                                key={level}
                                onClick={() => setDifficulty(level)}
                                className={`selector-button ${difficulty === level ? 'active' : ''}`}
                            >
                                {level.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Language Title + Controls */}
                <h2>{uiLanguage === 'en' ? 'Select Languages to Play With' : 'Sélectionnez les langues du jeu'}</h2>
                <div className="selector-buttons">
                    <button onClick={selectAll} className="selector-button small">
                        {uiLanguage === 'en' ? 'Select All' : 'Tout sélectionner'}
                    </button>
                    <button onClick={unselectAll} className="selector-button small">
                        {uiLanguage === 'en' ? 'Unselect All' : 'Tout désélectionner'}
                    </button>
                </div>

                {/* Languages */}
                <div className="language-list">
                    {languagesList.map(language => (
                        <button
                            key={language.en}
                            onClick={() => toggleLanguage(language)}
                            className={`language-button ${selectedLanguages.includes(language.en) ? 'active' : ''}`}
                        >
                            {uiLanguage === 'en' ? language.en : language.fr}
                        </button>
                    ))}
                </div>

                {/* Start Button */}
                <div className="start-button-container">
                    <button onClick={handleSubmit} className="start-button-futuristic">
                        {uiLanguage === 'en' ? 'Start Game' : 'Démarrer le jeu'}
                    </button>
                </div>

                <div className="footer">© Oranginal</div>
            </div>
        </div>
    );
}

export default LanguageSelector;

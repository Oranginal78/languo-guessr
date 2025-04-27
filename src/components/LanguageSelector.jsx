import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import bg7 from '../images/fond7.png'; // chemin correct

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

    const selectAll = () => {
        setSelectedLanguages(languagesList.map(lang => lang.en));
    };

    const unselectAll = () => {
        setSelectedLanguages([]);
    };

    const handleSubmit = () => {
        if (selectedLanguages.length >= 3) {
            onValidate(selectedLanguages, difficulty, uiLanguage);
        } else {
            alert(uiLanguage === 'en' ? 'Please select at least 3 languages.' : 'Veuillez sélectionner au moins 3 langues.');
        }
    };

    return (
        <div className="selector-background" style={{ backgroundImage: `url(${bg7})` }}>
            {/* Oranginal AI Lab Button CENTRÉ */}
            <div className="center-top-link">
                <Link to="/about" className="lab-link-button">Oranginal AI Lab</Link>
            </div>

            {/* Glass Card */}
            <div className="glass-card-futuristic" style={{ textAlign: 'center', marginTop: '3rem' }}>
                {/* Grand titre */}
                <h1 className="highlight-text">Languo Guessr</h1>

                {/* Choix langue UI */}
                <div className="option-line">
                    <div className="option-title">{uiLanguage === 'en' ? 'Choose UI Language' : 'Choisissez la langue du jeu'}</div>
                    <div className="selector-buttons">
                        <button onClick={() => setUiLanguage('en')} className={uiLanguage === 'en' ? 'selector-button active' : 'selector-button'}>English</button>
                        <button onClick={() => setUiLanguage('fr')} className={uiLanguage === 'fr' ? 'selector-button active' : 'selector-button'}>Français</button>
                    </div>
                </div>

                {/* Choix difficulté */}
                <div className="option-line">
                    <div className="option-title">{uiLanguage === 'en' ? 'Select Difficulty' : 'Sélectionnez la difficulté'}</div>
                    <div className="selector-buttons">
                        {['easy', 'normal', 'hard'].map(level => (
                            <button key={level} onClick={() => setDifficulty(level)} className={difficulty === level ? 'selector-button active' : 'selector-button'}>
                                {level.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Langues à choisir */}
                <h2>{uiLanguage === 'en' ? 'Select Languages to Play With' : 'Sélectionnez les langues du jeu'}</h2>
                <div className="selector-actions">
                    <button onClick={selectAll} className="selector-button small">
                        {uiLanguage === 'en' ? 'Select All' : 'Tout sélectionner'}
                    </button>
                    <button onClick={unselectAll} className="selector-button small">
                        {uiLanguage === 'en' ? 'Unselect All' : 'Tout désélectionner'}
                    </button>
                </div>

                {/* Liste des langues */}
                <div className="language-list">
                    {languagesList.map(language => (
                        <button key={language.en} onClick={() => toggleLanguage(language)} className={selectedLanguages.includes(language.en) ? 'language-button active' : 'language-button'}>
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

                {/* Footer */}
                <div className="footer">
                    © Oranginal
                </div>
            </div>
        </div>
    );
}

export default LanguageSelector;

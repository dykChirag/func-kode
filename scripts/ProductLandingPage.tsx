import React, { useState } from 'react';
interface BaseComponentProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}
interface LandingPageProps extends BaseComponentProps {}
const AutoLayoutVertical: React.FC<BaseComponentProps> = ({
  className,
  style,
  children
}) => {
  return <div className={`auto-layout-vertical ${className || ''}`.trim()} style={{
    width: '60px',
    height: '20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
    boxSizing: 'border-box',
    borderRadius: '8px',
    overflow: 'hidden',
    position: 'relative',
    ...style
  }}>
      <div style={{
      width: 'auto',
      height: 'auto',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '4px',
      boxSizing: 'border-box',
      flexShrink: 0
    }}>
        {children}
      </div>
    </div>;
};
export const ProductLandingPage: React.FC<LandingPageProps> = ({
  className,
  style
}) => {
  const [email, setEmail] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const handleCtaClick = (label: string) => {
    console.log(`${label} clicked`);
  };
  const navItemStyle: React.CSSProperties = {
    cursor: 'pointer',
    transition: 'opacity 0.2s ease'
  };
  return <div className={`landing-page ${className || ''}`.trim()} style={{
    width: '100%',
    minWidth: '1440px',
    height: '4727px',
    background: 'linear-gradient(180deg, rgba(4, 7, 16, 1.00) 4%, rgba(112, 32, 191, 1.00) 35%, rgba(17, 27, 52, 1.00) 64%, rgba(17, 27, 52, 1.00) 88%)',
    boxSizing: 'border-box',
    overflow: 'hidden',
    position: 'relative',
    ...style
  }}>
      {/* Background Layers */}
      <div className="background-decor" style={{
      width: '7119.2px',
      height: '5419.1px',
      position: 'absolute',
      left: '-2020px',
      top: '847px',
      pointerEvents: 'none'
    }}>
        <div style={{
        width: '851.7px',
        height: '587.4px',
        backgroundColor: 'rgba(244, 162, 89, 0.1)',
        filter: 'blur(200px)',
        position: 'absolute',
        left: '2365.2px',
        top: '641.3px',
        borderRadius: '50%'
      }} />
        <div style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        left: 0,
        top: 0
      }}>
          <img src="https://storage.googleapis.com/storage.magicpath.ai/user/412601400984485888/figma-assets/94db122b-4708-4961-b5a6-ba30ea980342.svg" alt="" style={{
          width: '2275.8px',
          height: '1759.8px',
          position: 'absolute',
          left: '2005.1px',
          top: '42.6px'
        }} />
          <img src="https://storage.googleapis.com/storage.magicpath.ai/user/412601400984485888/figma-assets/0718c297-dbda-4aab-adb9-e073dc30a872.svg" alt="" style={{
          width: '4788.7px',
          height: '3307.1px',
          opacity: 0.4,
          position: 'absolute',
          left: '812.8px',
          top: '1554.6px'
        }} />
        </div>
        <img src="https://storage.googleapis.com/storage.magicpath.ai/user/412601400984485888/figma-assets/6c956e93-0ce3-4c7a-a53f-fd317d35b1ab.svg" alt="" style={{
        width: '838.7px',
        height: '1623.7px',
        opacity: 0.3,
        position: 'absolute',
        left: '1447.3px',
        top: '2638.4px'
      }} />
      </div>

      <div className="background-decor-top" style={{
      width: '4360.4px',
      height: '4358.5px',
      position: 'absolute',
      left: '-1066.9px',
      top: '-1280.3px',
      pointerEvents: 'none'
    }}>
        <div style={{
        width: '579px',
        height: '579px',
        backgroundColor: 'rgba(112, 32, 191, 1)',
        border: '1px solid rgba(0, 201, 183, 1)',
        filter: 'blur(200px)',
        position: 'absolute',
        left: '1607.9px',
        top: '1526.3px',
        borderRadius: '50%'
      }} />
        <img src="https://storage.googleapis.com/storage.magicpath.ai/user/412601400984485888/figma-assets/d68cac45-eefd-40dd-aa9b-a61718766d7e.svg" alt="" style={{
        width: '1547.1px',
        height: '1734.7px',
        position: 'absolute',
        left: '1363.1px',
        top: '936.2px'
      }} />
        <img src="https://storage.googleapis.com/storage.magicpath.ai/user/412601400984485888/figma-assets/14182802-377f-4d5e-8326-22346427c074.svg" alt="" style={{
        width: '867.3px',
        height: '917px',
        position: 'absolute',
        left: '1702.7px',
        top: '1609.1px'
      }} />
        <img src="https://storage.googleapis.com/storage.magicpath.ai/user/412601400984485888/figma-assets/ea85d2be-7ab5-47c3-9629-f115d3bb0b59.svg" alt="" style={{
        width: '3255.3px',
        height: '3259.7px',
        opacity: 0.4,
        position: 'absolute',
        left: '552.6px',
        top: '549.4px'
      }} />
        <img src="https://storage.googleapis.com/storage.magicpath.ai/user/412601400984485888/figma-assets/46a9b17c-a26e-41d5-8947-415d9d283326.svg" alt="" style={{
        width: '906.4px',
        height: '939.7px',
        position: 'absolute',
        left: '0.8px',
        top: '1.1px'
      }} />
        <img src="https://storage.googleapis.com/storage.magicpath.ai/user/412601400984485888/figma-assets/3acffe6b-b7ad-4de0-8c38-f744a7c6d8b1.svg" alt="" style={{
        width: '570.2px',
        height: '1600.4px',
        opacity: 0.3,
        position: 'absolute',
        left: '983.9px',
        top: '1617.7px'
      }} />
      </div>

      {/* Header / Nav */}
      <nav className="menu" style={{
      width: '698px',
      height: '36px',
      display: 'flex',
      flexDirection: 'row',
      padding: '8px',
      gap: '50px',
      boxSizing: 'border-box',
      position: 'absolute',
      left: '217px',
      top: '41px',
      zIndex: 10
    }}>
        <span style={{
        ...navItemStyle,
        color: '#FFFFFF',
        fontSize: '14px',
        fontFamily: 'Poppins',
        fontWeight: 700,
        letterSpacing: '-0.56px'
      }}>How It Works</span>
        <span style={{
        ...navItemStyle,
        color: '#FFFFFF',
        fontSize: '14px',
        fontFamily: 'Poppins',
        fontWeight: 700,
        letterSpacing: '-0.56px'
      }}>For Developers</span>
        <span style={{
        ...navItemStyle,
        color: '#FFFFFF',
        fontSize: '14px',
        fontFamily: 'Poppins',
        fontWeight: 700,
        letterSpacing: '-0.56px'
      }}>For Teams & Platforms</span>
        <span style={{
        ...navItemStyle,
        color: '#FFFFFF',
        fontSize: '14px',
        fontFamily: 'Poppins',
        fontWeight: 700,
        letterSpacing: '-0.56px'
      }}>The Score</span>
        <span style={{
        ...navItemStyle,
        color: '#FFFFFF',
        fontSize: '14px',
        fontFamily: 'Poppins',
        fontWeight: 700,
        letterSpacing: '-0.56px'
      }}>func(kode)</span>
      </nav>

      <button className="sign-in" onClick={() => handleCtaClick('Connect')} onMouseEnter={e => e.currentTarget.style.opacity = '0.9'} onMouseLeave={e => e.currentTarget.style.opacity = '1'} style={{
      width: '85px',
      height: '40px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      border: 'none',
      borderRadius: '40px',
      position: 'absolute',
      left: '1245px',
      top: '43px',
      cursor: 'pointer',
      zIndex: 10
    }}>
        <span style={{
        color: '#000000',
        fontSize: '14px',
        fontFamily: 'Source Sans Pro',
        fontWeight: 700,
        letterSpacing: '-0.42px'
      }}>Connect</span>
      </button>

      <img src="https://storage.googleapis.com/storage.magicpath.ai/user/412601400984485888/figma-assets/1b0d1bc7-cb6e-4f37-a495-996b17de0185.png" alt="Logo" style={{
      width: '57px',
      height: '51px',
      position: 'absolute',
      left: '122px',
      top: '37px',
      objectFit: 'cover'
    }} />

      {/* Hero Section */}
      <section className="content" style={{
      width: '459px',
      height: '423px',
      position: 'absolute',
      left: '122px',
      top: '272px',
      zIndex: 5
    }}>
        <span style={{
        display: 'block',
        color: '#EDFFD7',
        fontSize: '16px',
        fontFamily: 'Poppins',
        fontWeight: 700,
        letterSpacing: '-0.48px',
        marginBottom: '18px'
      }}>TRUST COMMITS, NOT COVER LETTERS</span>
        <h1 style={{
        width: '396px',
        color: '#FFFFFF',
        fontSize: '46px',
        fontFamily: 'Poppins',
        fontWeight: 700,
        lineHeight: '54.1px',
        letterSpacing: '-1.38px',
        margin: '0 0 14px 0'
      }}>
          Build together.<br />Ship Faster.<br />Contribute with purpose.
        </h1>
        <p style={{
        width: '456px',
        color: '#FFFFFF',
        fontSize: '16px',
        fontFamily: 'Source Sans Pro',
        fontWeight: 400,
        lineHeight: '25.4px',
        letterSpacing: '-0.48px',
        margin: '0 0 11px 0'
      }}>
          func(kode) is an open-source developer platform for the Patch ID community. Sign up with GitHub, join collaborative builds, and contribute to projects that matter.
        </p>
        <div style={{
        display: 'flex',
        gap: '47px',
        marginTop: '11px'
      }}>
          <button onClick={() => handleCtaClick('Start Contributing')} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'} style={{
          width: '156px',
          height: '50px',
          backgroundColor: '#FFFFFF',
          border: 'none',
          borderRadius: '40px',
          cursor: 'pointer',
          fontSize: '15px',
          fontFamily: 'Source Sans Pro',
          fontWeight: 700,
          letterSpacing: '-0.45px',
          color: '#000',
          transition: 'transform 0.2s'
        }}>
            Start Contributing
          </button>
          <button onClick={() => handleCtaClick('Explore the project')} onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'} style={{
          width: '160px',
          height: '50px',
          backgroundColor: 'transparent',
          border: '2px solid rgba(255, 255, 255, 0.13)',
          borderRadius: '40px',
          cursor: 'pointer',
          fontSize: '15px',
          fontFamily: 'Source Sans Pro',
          fontWeight: 700,
          letterSpacing: '-0.45px',
          color: '#FFF',
          transition: 'background-color 0.2s'
        }}>
            Explore the project
          </button>
        </div>
      </section>

      {/* Browser Mockup */}
      <div className="browser" style={{
      width: '800px',
      height: '584.2px',
      position: 'absolute',
      left: '572px',
      top: '272px'
    }}>
        <img src="https://storage.googleapis.com/storage.magicpath.ai/user/412601400984485888/figma-assets/00d06e85-5b5a-459e-b363-02cdd4f11e90.svg" alt="Browser" style={{
        width: '800px',
        height: '544.8px',
        position: 'absolute'
      }} />
        <div style={{
        position: 'absolute',
        top: '7.5px',
        left: '9px',
        width: '778px',
        height: '15px',
        display: 'flex',
        alignItems: 'center'
      }}>
          <div style={{
          width: '6px',
          height: '6px',
          backgroundColor: '#D8695B',
          borderRadius: '50%',
          marginRight: '4px'
        }} />
          <div style={{
          width: '6px',
          height: '6px',
          backgroundColor: '#EAC213',
          borderRadius: '50%',
          marginRight: '4px'
        }} />
          <div style={{
          width: '6px',
          height: '6px',
          backgroundColor: '#79C743',
          borderRadius: '50%',
          marginRight: '20px'
        }} />
          <div style={{
          width: '327.6px',
          height: '15px',
          backgroundColor: 'rgba(113, 122, 132, 0.2)',
          borderRadius: '4px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
            <span style={{
            color: '#717A84',
            fontSize: '9px',
            fontFamily: 'Mulish',
            fontWeight: 600
          }}>app.yourapp.io</span>
          </div>
        </div>
        <img src="https://storage.googleapis.com/storage.magicpath.ai/user/412601400984485888/figma-assets/da8f59c9-f466-42cb-8cab-8f32a8c6090e.png" alt="Artwork" style={{
        width: '799.8px',
        height: '514.5px',
        position: 'absolute',
        left: '0px',
        top: '30.3px',
        objectFit: 'cover'
      }} />
      </div>

      {/* Why func(kode) Section */}
      <section className="why-section" style={{
      width: '100%',
      height: '687px',
      backgroundColor: 'rgba(17, 15, 15, 0.25)',
      position: 'absolute',
      top: '977px'
    }}>
        <div style={{
        maxWidth: '1300px',
        margin: '80px auto',
        textAlign: 'center'
      }}>
          <h2 style={{
          color: '#FFFFFF',
          fontSize: '40px',
          fontFamily: 'Poppins',
          fontWeight: 700,
          marginBottom: '24px'
        }}>Why func(kode) ?</h2>
          <p style={{
          maxWidth: '634px',
          margin: '0 auto 40px',
          color: 'rgba(231, 231, 231, 0.6)',
          fontSize: '16px',
          fontFamily: 'Poppins',
          lineHeight: '24px'
        }}>
            func(kode) helps developers move from idea to contribution with a shared platform, clear workflows and visible progress. It is built for community driven development, not just code storage.
          </p>
          <div style={{
          display: 'flex',
          gap: '32px',
          padding: '0 111px'
        }}>
            {[{
            title: 'GitHub-first onboarding',
            desc: 'Sign in with GitHub and get started in seconds',
            icon: '29f0a72f-b7ca-485d-868f-97332a85e64a'
          }, {
            title: 'Contribution tracking',
            desc: 'See issues, pull requests and progress in one place',
            icon: '85e7828f-9259-4fc0-89d7-e06686fca579'
          }, {
            title: 'Community collaboration',
            desc: 'Work with other contributors through transparent workflows.',
            icon: '0478a3e0-d292-4c2f-b7ca-5e32b8789f6c'
          }].map((feature, i) => <div key={i} style={{
            flex: 1,
            padding: '20px',
            border: '1px solid #A1AEBF',
            borderRadius: '4px',
            textAlign: 'left',
            transition: 'border-color 0.2s'
          }}>
                <img src={`https://storage.googleapis.com/storage.magicpath.ai/user/412601400984485888/figma-assets/${feature.icon}.svg`} alt="" style={{
              width: '48px',
              height: '48px',
              marginBottom: '12px'
            }} />
                <h3 style={{
              color: '#FFFFFF',
              fontSize: '28px',
              fontFamily: 'Poppins',
              fontWeight: 700,
              margin: '0 0 12px 0'
            }}>{feature.title}</h3>
                <p style={{
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '14px',
              fontFamily: 'Poppins',
              lineHeight: '20px'
            }}>{feature.desc}</p>
              </div>)}
          </div>
          <p style={{
          maxWidth: '634px',
          margin: '40px auto 0',
          color: 'rgba(231, 231, 231, 0.6)',
          fontSize: '16px',
          fontFamily: 'Poppins',
          lineHeight: '24px'
        }}>
            Build features that support the Patch ID ecosystem. Everything is designed to welcome contributors and make participation easier.
          </p>
        </div>
      </section>

      {/* Stepper Section */}
      <section style={{
      width: '100%',
      position: 'absolute',
      top: '1678px',
      textAlign: 'center'
    }}>
        <h2 style={{
        color: '#FFFFFF',
        fontSize: '40px',
        fontFamily: 'Poppins',
        fontWeight: 700
      }}>How Patch ID Scores You?</h2>
        <div className="stepper" style={{
        width: '400px',
        margin: '59px auto',
        position: 'relative',
        textAlign: 'left'
      }}>
          {/* Step 1 */}
          <div style={{
          display: 'flex',
          gap: '24px',
          padding: '16px 24px'
        }}>
            <div style={{
            width: '20px',
            height: '20px',
            backgroundColor: '#495AFF',
            borderRadius: '10px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexShrink: 0
          }}>
              <img src="https://storage.googleapis.com/storage.magicpath.ai/user/412601400984485888/figma-assets/391dc63f-48d1-4a33-b83a-dcb1a056474a.svg" alt="" style={{
              width: '12px'
            }} />
            </div>
            <div>
              <div style={{
              color: '#FFF',
              fontSize: '12px',
              fontFamily: 'Roboto',
              marginBottom: '4px'
            }}>Step 1</div>
              <div style={{
              color: '#FFF',
              fontSize: '14px',
              fontFamily: 'Roboto',
              fontWeight: 500,
              marginBottom: '10px'
            }}>Connect GitHub</div>
              <p style={{
              color: '#FFF',
              fontSize: '14px',
              fontFamily: 'Roboto',
              lineHeight: '20px',
              width: '392px'
            }}>
                Connect your GitHub account with func(kode) in one click. Patch ID reads your public contribution activity – PRs, reviews, merges – without touching your private code.
              </p>
            </div>
          </div>
          {/* Step 2 */}
          <div style={{
          display: 'flex',
          gap: '24px',
          padding: '16px 24px',
          marginTop: '40px'
        }}>
            <div style={{
            width: '20px',
            height: '20px',
            border: '0.5px solid #495AFF',
            borderRadius: '10px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexShrink: 0
          }}>
              <div style={{
              width: '10px',
              height: '10px',
              backgroundColor: '#495AFF',
              borderRadius: '5px'
            }} />
            </div>
            <div>
              <div style={{
              color: '#FFF',
              fontSize: '12px',
              fontFamily: 'Roboto',
              marginBottom: '4px'
            }}>Step 2</div>
              <div style={{
              color: '#FFF',
              fontSize: '14px',
              fontFamily: 'Roboto',
              fontWeight: 500,
              marginBottom: '10px'
            }}>We analyze your signals</div>
              <p style={{
              color: '#FFF',
              fontSize: '14px',
              fontFamily: 'Roboto',
              lineHeight: '20px',
              whiteSpace: 'pre-line'
            }}>
                We look at the signals that actually matter:{"\n"}PR merge rate{"\n"}Code survival over time{"\n"}Peer review participation{"\n"}Recent activity and responsiveness{"\n"}Each signal is normalized, weighted, and versioned in our scoring engine.
              </p>
            </div>
          </div>
          {/* Arrows */}
          <div style={{
          position: 'absolute',
          left: '34px',
          top: '71px',
          height: '80px',
          borderLeft: '1px solid #495AFF'
        }} />
          <div style={{
          position: 'absolute',
          left: '34px',
          top: '253px',
          height: '80px',
          borderLeft: '1px solid #CFD6DC'
        }} />
        </div>
      </section>

      {/* For Teams Section */}
      <section style={{
      width: '100%',
      height: '596px',
      backgroundColor: 'rgba(0, 0, 0, 0.25)',
      position: 'absolute',
      top: '2358px'
    }}>
        <img src="https://storage.googleapis.com/storage.magicpath.ai/user/412601400984485888/figma-assets/e97848b7-b546-49f2-ac4b-d5867d358a62.svg" alt="" style={{
        width: '798px',
        height: '361px',
        position: 'absolute',
        left: '0',
        top: '120px'
      }} />
        <div style={{
        position: 'absolute',
        left: '815px',
        top: '151px',
        maxWidth: '523px'
      }}>
          <h2 style={{
          color: '#FFF',
          fontSize: '40px',
          fontFamily: 'Poppins',
          fontWeight: 700,
          margin: '0 0 16px 0'
        }}>For Teams & Platforms</h2>
          <p style={{
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: '16px',
          fontFamily: 'Poppins',
          lineHeight: '24px',
          marginBottom: '32px'
        }}>
            If you run a dev‑heavy startup, a hiring platform, or a community, Patch ID plugs into your flow as a trust signal, not a replacement for your process.
          </p>
          <p style={{
          color: '#FFA800',
          fontSize: '14px',
          fontFamily: 'Poppins',
          fontWeight: 700,
          textTransform: 'uppercase',
          marginBottom: '32px'
        }}>We’re onboarding a small number of design partners.</p>
          <button onClick={() => handleCtaClick('Want in')} style={{
          width: '131px',
          height: '45px',
          border: '1px solid #FFA800',
          borderRadius: '1000px',
          backgroundColor: 'transparent',
          color: '#F4A259',
          fontSize: '14px',
          fontFamily: 'Poppins',
          fontWeight: 700,
          cursor: 'pointer'
        }}>
            WANT IN? →
          </button>
        </div>
      </section>

      {/* For Developers Section */}
      <section style={{
      width: '100%',
      height: '596px',
      backgroundColor: 'rgba(0, 0, 0, 0.25)',
      position: 'absolute',
      top: '3104px'
    }}>
        <img src="https://storage.googleapis.com/storage.magicpath.ai/user/412601400984485888/figma-assets/1b07cbca-d44a-4e63-82d6-f788c82d383e.svg" alt="" style={{
        width: '798px',
        height: '361px',
        position: 'absolute',
        left: '0',
        top: '120px'
      }} />
        <div style={{
        position: 'absolute',
        left: '815px',
        top: '92px',
        maxWidth: '523px'
      }}>
          <h2 style={{
          color: '#FFF',
          fontSize: '40px',
          fontFamily: 'Poppins',
          fontWeight: 700,
          margin: '0 0 16px 0'
        }}>For developers who want their work to speak.</h2>
          <p style={{
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: '16px',
          fontFamily: 'Poppins',
          lineHeight: '24px',
          marginBottom: '32px'
        }}>
            Whether you’re a fresher fighting keyword filters, or a freelancer explaining your value to global clients, Patch ID gives you a single link that proves your work – not your buzzwords.
          </p>
          <p style={{
          color: '#F4A259',
          fontSize: '14px',
          fontFamily: 'Poppins',
          fontWeight: 700,
          textTransform: 'uppercase'
        }}>
            Add your Patch ID score to your resume, LinkedIn, or portfolio and let your code do the talking.
          </p>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section style={{
      width: '100%',
      height: '524px',
      backgroundColor: 'rgba(17, 15, 15, 0.25)',
      position: 'absolute',
      top: '3716px'
    }}>
        <div style={{
        width: '1300px',
        margin: '24px auto',
        height: '420px',
        backgroundColor: '#F4A259',
        borderRadius: '4px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '0 32px'
      }}>
          <h2 style={{
          color: '#0D0E14',
          fontSize: '40px',
          fontFamily: 'Poppins',
          fontWeight: 700,
          maxWidth: '900px',
          marginBottom: '16px'
        }}>Your next opportunity should see your work, not just your resume.</h2>
          <p style={{
          color: 'rgba(0, 0, 0, 0.6)',
          fontSize: '16px',
          fontFamily: 'Poppins',
          marginBottom: '32px'
        }}>Patch ID is in early build. We’re onboarding our first developers and design partners now.</p>
          <div style={{
          display: 'flex',
          gap: '16px'
        }}>
            <input type="email" placeholder="Talk To Us" value={email} onChange={e => setEmail(e.target.value)} style={{
            width: '320px',
            height: '52px',
            border: '2px solid #A1AEBF',
            borderRadius: '30px',
            padding: '0 24px',
            fontSize: '16px',
            fontFamily: 'Archivo'
          }} />
            <button onClick={() => handleCtaClick('Send Contact')} style={{
            padding: '0 24px',
            height: '52px',
            backgroundColor: '#000',
            color: '#FFF',
            border: 'none',
            borderRadius: '1000px',
            fontSize: '14px',
            fontWeight: 700,
            cursor: 'pointer'
          }}>
              SEND
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
      width: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.25)',
      position: 'absolute',
      top: '4224px',
      padding: '80px 70px 40px'
    }}>
        <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '80px'
      }}>
          {/* Logo Column */}
          <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
            <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
              <img src="https://storage.googleapis.com/storage.magicpath.ai/user/412601400984485888/figma-assets/1b0d1bc7-cb6e-4f37-a495-996b17de0185.png" alt="" style={{
              width: '57px'
            }} />
              <span style={{
              color: '#FFF',
              fontSize: '16px',
              fontWeight: 800,
              fontFamily: 'Poppins'
            }}>PATCH ID</span>
            </div>
            <p style={{
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: '14px',
            fontFamily: 'Agrandir'
          }}>Get latest updates</p>
            <div style={{
            display: 'flex',
            gap: '13px'
          }}>
              <input placeholder="Your email" value={newsletterEmail} onChange={e => setNewsletterEmail(e.target.value)} style={{
              width: '260px',
              height: '43px',
              backgroundColor: '#0F0F0F',
              border: '1.6px solid #A1AEBF',
              borderRadius: '24px',
              padding: '0 13px',
              color: '#FFF'
            }} />
            </div>
          </div>
          {/* Links Columns */}
          {[{
          title: 'Patch ID',
          links: ['What is Patch ID?', 'What is func(kode) ?', 'Team', 'Careers']
        }, {
          title: 'Product',
          links: ['Connect via GitHub', 'Partner with Us', 'Hire Talent', 'Mobile app', 'func(kode)', 'Raccoon AI']
        }, {
          title: 'Resources',
          links: ['Blog', 'Case study', 'Testimonials']
        }, {
          title: 'Follow us',
          links: ['Instagram', 'LinkedIn']
        }].map((col, i) => <div key={i} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
              <span style={{
            color: '#FFF',
            fontSize: '16px',
            fontWeight: 700,
            fontFamily: 'Poppins'
          }}>{col.title}</span>
              {col.links.map((link, j) => <span key={j} style={{
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: '16px',
            fontFamily: 'Archivo',
            cursor: 'pointer'
          }}>{link}</span>)}
            </div>)}
        </div>
        <div style={{
        textAlign: 'center',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        paddingTop: '40px'
      }}>
          <span style={{
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: '16px',
          fontFamily: 'Poppins'
        }}>Incubated by bbuilds.org</span>
        </div>
      </footer>
    </div>;
};
import React, { useState } from 'react';
import styled from 'styled-components';
import api from '../utils/api';

const Wrap = styled.div`
  background:rgba(245,158,11,0.04);
  border:1px solid rgba(245,158,11,0.15);
  border-radius:12px;padding:16px 20px;
  display:flex;align-items:center;gap:20px;flex-wrap:wrap;
`;
const Score = styled.div`
  display:flex;align-items:center;gap:10px;
`;
const BigNum = styled.span`
  font-size:2rem;font-weight:900;
  color:${p=>
    p.score>=90?'#a855f7':
    p.score>=70?'#22c55e':
    p.score>=40?'#f59e0b':'#ef4444'
  };
`;
const Meta = styled.div`font-size:0.78rem;color:#6b5a3e;`;
const Buttons = styled.div`display:flex;gap:6px;flex-wrap:wrap;`;
const RateBtn = styled.button`
  padding:6px 12px;border-radius:8px;font-size:0.8rem;font-weight:700;cursor:pointer;transition:all 0.15s;
  border:1px solid ${p=>p.active?'#f59e0b':'rgba(245,158,11,0.2)'};
  background:${p=>p.active?'rgba(245,158,11,0.2)':'transparent'};
  color:${p=>p.active?'#f59e0b':'#b8a07a'};
  &:hover{border-color:#f59e0b;color:#f59e0b;background:rgba(245,158,11,0.1);}
`;
const Label = styled.span`font-size:0.8rem;color:#b8a07a;font-weight:600;white-space:nowrap;`;

const QUICK = [
  {score:0,label:'Poor'},
  {score:25,label:'Fair'},
  {score:50,label:'Good'},
  {score:75,label:'Great'},
  {score:100,label:'Perfect'},
];

const RatingWidget = ({ postId, avgRating, totalRatings, userRating, onRated }) => {
  const [loading, setLoading] = useState(false);
  const [myRating, setMyRating] = useState(userRating);

  const rate = async (score) => {
    setLoading(true);
    try {
      const res = await api.post(`/api/posts/${postId}/rate`, { score });
      setMyRating(score);
      onRated && onRated(res.data);
    } catch (e) {
      console.error(e);
    } finally { setLoading(false); }
  };

  return (
    <Wrap>
      <Score>
        <BigNum score={avgRating}>
          {avgRating || 0}
        </BigNum>
        <Meta>
          <div>/100</div>
          <div>{totalRatings || 0} rating{totalRatings !== 1 ? 's' : ''}</div>
        </Meta>
      </Score>
      <div>
        <Label>Rate this project:</Label>
        <Buttons style={{marginTop:8}}>
          {QUICK.map(q => (
            <RateBtn
              key={q.score}
              active={myRating === q.score}
              disabled={loading}
              onClick={() => rate(q.score)}
            >
              {q.score} – {q.label}
            </RateBtn>
          ))}
        </Buttons>
        {myRating !== undefined && myRating !== null && (
          <div style={{fontSize:'0.75rem',color:'#6b5a3e',marginTop:6}}>
            Your rating: <strong style={{color:'#f59e0b'}}>{myRating}</strong>
          </div>
        )}
      </div>
    </Wrap>
  );
};
export default RatingWidget;

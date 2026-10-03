from datetime import datetime, timezone
from typing import Any

from sqlalchemy import (
    DateTime,
    ForeignKey,
    Integer,
    JSON,
    String,
    Text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base


class User(Base):
    __tablename__ = "users"

    user_id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
        index=True,
    )

    password_hash: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=lambda: datetime.now(timezone.utc).replace(tzinfo=None),
        nullable=False,
    )

    analyses: Mapped[list["Analysis"]] = relationship(
        back_populates="user",
    )


class Role(Base):
    __tablename__ = "roles"

    role_id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    role_name: Mapped[str] = mapped_column(
        String(150),
        unique=True,
        nullable=False,
        index=True,
    )

    description: Mapped[str] = mapped_column(
        Text,
        default="",
        nullable=False,
    )

    analyses: Mapped[list["Analysis"]] = relationship(
        back_populates="role",
    )

    role_skills: Mapped[list["RoleSkill"]] = relationship(
        back_populates="role",
        cascade="all, delete-orphan",
    )

    project_recommendations: Mapped[
        list["ProjectRecommendation"]
    ] = relationship(
        back_populates="role",
        cascade="all, delete-orphan",
    )


class Skill(Base):
    __tablename__ = "skills"

    skill_id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    skill_name: Mapped[str] = mapped_column(
        String(150),
        unique=True,
        nullable=False,
        index=True,
    )

    category: Mapped[str] = mapped_column(
        String(100),
        default="",
        nullable=False,
    )

    role_skills: Mapped[list["RoleSkill"]] = relationship(
        back_populates="skill",
        cascade="all, delete-orphan",
    )

    skill_gaps: Mapped[list["SkillGap"]] = relationship(
        back_populates="skill",
        cascade="all, delete-orphan",
    )

    learning_resources: Mapped[
        list["LearningResource"]
    ] = relationship(
        back_populates="skill",
        cascade="all, delete-orphan",
    )


class RoleSkill(Base):
    __tablename__ = "role_skills"

    role_id: Mapped[int] = mapped_column(
        ForeignKey("roles.role_id"),
        primary_key=True,
    )

    skill_id: Mapped[int] = mapped_column(
        ForeignKey("skills.skill_id"),
        primary_key=True,
    )

    importance: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="medium",
    )

    role: Mapped["Role"] = relationship(
        back_populates="role_skills",
    )

    skill: Mapped["Skill"] = relationship(
        back_populates="role_skills",
    )


class Analysis(Base):
    __tablename__ = "analyses"

    # Public analysis ID used by the API and frontend.
    # Example:
    # df87677f-e040-48af-8123-fe79c5d5a45e
    analysis_id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
    )

    user_id: Mapped[int | None] = mapped_column(
        ForeignKey("users.user_id"),
        nullable=True,
    )

    role_id: Mapped[int] = mapped_column(
        ForeignKey("roles.role_id"),
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=lambda: datetime.now(timezone.utc).replace(tzinfo=None),
        nullable=False,
    )

    overall_score: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    # Complete persisted analysis sections.
    #
    # These allow the frontend to retrieve the same analysis
    # after a page refresh or when opening the analysis URL
    # directly.
    #
    # The original uploaded CV and extracted resume_text are
    # intentionally not stored here.
    resume_data: Mapped[dict[str, Any] | None] = mapped_column(
        JSON,
        nullable=True,
    )

    role_requirements: Mapped[dict[str, Any] | None] = mapped_column(
        JSON,
        nullable=True,
    )

    skill_comparison: Mapped[dict[str, Any] | None] = mapped_column(
        JSON,
        nullable=True,
    )

    requirement_evidence: Mapped[dict[str, Any] | None] = mapped_column(
        JSON,
        nullable=True,
    )

    ats_analysis: Mapped[dict[str, Any] | None] = mapped_column(
        JSON,
        nullable=True,
    )

    resume_quality: Mapped[dict[str, Any] | None] = mapped_column(
        JSON,
        nullable=True,
    )

    improvement_recommendations: Mapped[
        list[dict[str, Any]] | None
    ] = mapped_column(
        JSON,
        nullable=True,
    )

    learning_recommendations: Mapped[
        list[dict[str, Any]] | None
    ] = mapped_column(
        JSON,
        nullable=True,
    )

    project_recommendations: Mapped[
        list[dict[str, Any]] | None
    ] = mapped_column(
        JSON,
        nullable=True,
    )

    market_insights: Mapped[
        list[dict[str, Any]] | None
    ] = mapped_column(
        JSON,
        nullable=True,
    )

    user: Mapped["User | None"] = relationship(
        back_populates="analyses",
    )

    role: Mapped["Role"] = relationship(
        back_populates="analyses",
    )

    skill_gaps: Mapped[list["SkillGap"]] = relationship(
        back_populates="analysis",
        cascade="all, delete-orphan",
    )

    recommendations: Mapped[
        list["Recommendation"]
    ] = relationship(
        back_populates="analysis",
        cascade="all, delete-orphan",
    )


class SkillGap(Base):
    __tablename__ = "skill_gaps"

    skill_gap_id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    analysis_id: Mapped[str] = mapped_column(
        ForeignKey("analyses.analysis_id"),
        nullable=False,
    )

    skill_id: Mapped[int] = mapped_column(
        ForeignKey("skills.skill_id"),
        nullable=False,
    )

    gap_level: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
    )

    explanation: Mapped[str] = mapped_column(
        Text,
        default="",
        nullable=False,
    )

    analysis: Mapped["Analysis"] = relationship(
        back_populates="skill_gaps",
    )

    skill: Mapped["Skill"] = relationship(
        back_populates="skill_gaps",
    )


class Recommendation(Base):
    __tablename__ = "recommendations"

    recommendation_id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    analysis_id: Mapped[str] = mapped_column(
        ForeignKey("analyses.analysis_id"),
        nullable=False,
    )

    type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    description: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    priority: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="medium",
    )

    analysis: Mapped["Analysis"] = relationship(
        back_populates="recommendations",
    )


class LearningResource(Base):
    __tablename__ = "learning_resources"

    resource_id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    skill_id: Mapped[int] = mapped_column(
        ForeignKey("skills.skill_id"),
        nullable=False,
    )

    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    provider: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    url: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    cost_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    skill: Mapped["Skill"] = relationship(
        back_populates="learning_resources",
    )


class ProjectRecommendation(Base):
    __tablename__ = "project_recommendations"

    project_id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    role_id: Mapped[int] = mapped_column(
        ForeignKey("roles.role_id"),
        nullable=False,
    )

    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    description: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    difficulty: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    role: Mapped["Role"] = relationship(
        back_populates="project_recommendations",
    )
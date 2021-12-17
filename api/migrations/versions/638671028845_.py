"""empty message

Revision ID: 638671028845
Revises: 
Create Date: 2021-12-16 23:21:57.935361

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '638671028845'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('point',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(), nullable=False),
    sa.Column('explanation', sa.String(), nullable=False),
    sa.Column('language', sa.String(), nullable=False),
    sa.Column('chapter', sa.String(), nullable=True),
    sa.Column('example1', sa.String(), nullable=True),
    sa.Column('example2', sa.String(), nullable=True),
    sa.Column('example3', sa.String(), nullable=True),
    sa.Column('created_by', sa.Integer(), nullable=False),
    sa.Column('date_created', sa.Date(), nullable=False),
    sa.ForeignKeyConstraint(['created_by'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('element',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('point_id', sa.Integer(), nullable=False),
    sa.Column('text', sa.String(), nullable=False),
    sa.Column('type', sa.String(), nullable=False),
    sa.ForeignKeyConstraint(['point_id'], ['point.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('element')
    op.drop_table('point')
    # ### end Alembic commands ###

"""empty message

Revision ID: 8cc638a52fba
Revises: f7df24f46daa
Create Date: 2022-10-02 11:59:29.250074

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '8cc638a52fba'
down_revision = 'f7df24f46daa'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('mail_in_repair', sa.Column('repair_completed', sa.Boolean(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('mail_in_repair', 'repair_completed')
    op.create_table('user',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('public_id', sa.VARCHAR(length=127), autoincrement=False, nullable=True),
    sa.Column('username', sa.VARCHAR(length=127), autoincrement=False, nullable=True),
    sa.Column('name', sa.VARCHAR(length=127), autoincrement=False, nullable=True),
    sa.Column('email', sa.VARCHAR(length=100), autoincrement=False, nullable=True),
    sa.Column('password', sa.VARCHAR(length=512), autoincrement=False, nullable=True),
    sa.Column('admin', sa.BOOLEAN(), autoincrement=False, nullable=True),
    sa.Column('registered_on', postgresql.TIMESTAMP(), autoincrement=False, nullable=False),
    sa.PrimaryKeyConstraint('id', name='user_pkey'),
    sa.UniqueConstraint('email', name='user_email_key'),
    sa.UniqueConstraint('public_id', name='user_public_id_key'),
    sa.UniqueConstraint('username', name='user_username_key')
    )
    # ### end Alembic commands ###
